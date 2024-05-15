import os
import re
import copy
import json
import html2text
from readability import Document
from bs4 import BeautifulSoup
from tabulate import tabulate

import tiktoken
from askrobot_common_lib import ( OPENAI_EMBEDDING )

from pprint import pprint

SCRIPT_DIR = os.path.realpath( os.path.dirname( __file__ ) )


#
# Cities
#
cities_hash = {}
cities_file = SCRIPT_DIR + '/cities.json'
if os.path.isfile( cities_file ):
    with open( cities_file, encoding="utf8" ) as f:
        cities_hash = json.load( f )

def get_cities_from_text( country, text ):
    city_names = []
    if (
        country != None
        and isinstance( country, str )
        and country.strip() != ""
        and text != None
        and text.strip() != ""
    ):
        country_lc = country.lower()
        if (
            country_lc in cities_hash
            and cities_hash[ country_lc ] != None
            and len( cities_hash[ country_lc ] ) > 0
        ):
            text_lc = text.lower()

            cities = cities_hash[ country_lc ]
            for i, city in enumerate( cities ):
                if 'type' not in city:
                    cities[ i ]['type'] = 'weak'

            for city in cities:
                city_lc = city['key'].lower()
                if (
                    city['label'] not in city_names
                    and (
                        city['type'] == 'strong'
                        and re.search( "[^а-яА-Я]" + city_lc + "[^а-яА-Я]|^" + city_lc + "[^а-яА-Я]|[^а-яА-Я]" + city_lc + "$|^" + city_lc + "$", text_lc ) != None

                        or

                        city['type'] == 'weak'
                        and (
                            city_lc in text_lc
                            or city_lc.replace("-", " ") in text_lc
                            or city_lc.replace("-", "") in text_lc
                        )
                    )
                ):
                    city_names.append( city['label'] )

    return city_names



#
# Text
#
def replace_special_chars( text ):
    text = text.replace("\xa0", ' ')
    text = text.replace("\t", ' ')
    text = re.sub( '[ ]{2,}', ' ', text )
    return text

#
# HTML & Markdown
#
def has_meaningful_image_dimenstion( value ):
    return int( re.sub( '\D+', '', value.split('.')[0] ) ) > 10

def html_to_pages( response_content, minimal_number_of_words = 8 ):
    if response_content == None or len( response_content ) == 0:
        return []

    h2t = html2text.HTML2Text( bodywidth = 0 )
    h2t.bypass_tables = True # Replace table manually

    # fix `**W ord**` bug, `__W ord__` bug
    for tag in ['b', 'u', 'i', 'strong']:
        response_content = response_content.replace( f'<{tag}>', '' )
        response_content = re.sub( f'<{tag}\s+?[^>]+?>', '', response_content )
        response_content = response_content.replace( f'</{tag}>', '')


    # save meaningful images
    soup = BeautifulSoup( response_content, 'html.parser' )

    for tag_name in ['img', 'iframe']:
        selected_tags = soup.select( tag_name )
        for tag in selected_tags:
            if (
                tag.get('src') != None and tag.get('src').strip() != ""
                and (
                    tag.get('style') != None and any(
                        ( "width:" in value or "height:" in value )
                        and ( "%" in value or "px" in value )
                        and has_meaningful_image_dimenstion( value )
                        for value in tag.get('style').split(';')
                    )
                    or tag.get('width') != None and has_meaningful_image_dimenstion( tag.get('width') )
                    or tag.get('height') != None and has_meaningful_image_dimenstion( tag.get('height') )
                )
            ):
                tag.replace_with(f" {tag['src']} ")

            else:
                tag.replace_with(' ')

    response_content = str( soup )


    doc = Document( response_content )
    page_content = doc.content()
    if page_content.startswith("b'") and page_content.endswith("'"):
        page_content = page_content[2:-1]

    page_content = re.sub( r"\\t", "\t", page_content )
    page_content = re.sub( r"(?:\\r)?\\n", "\n", page_content )
    page_content = h2t.handle( page_content )

    page_content = re.sub( r'\[([^]]*?)\]', lambda m: "[" + m.group(1).replace("\n", ' ') + "]", page_content )
    page_content = re.sub( r"!?\[\]\([^)]+?\)", "", page_content ) # image or empty links

    page_content = re.sub( r"(\[[^\]]*?)(\n{2,})(#+?\s+?)", r'\2\3\1', page_content )
    page_content = re.sub( r"(\[[^\]]*?)(\n{1,})", r'\2\1', page_content )
    page_content = re.sub( r"\n{1,}\[", '[', page_content )
    page_content = re.sub( r"\n{1,}\]", ']', page_content )

    page_content = re.sub( '!?\[[^]]+?\]\(data\:image[^)]+?\)', '', page_content )
    page_content = page_content.replace("\\'", "'")
    page_content = page_content.replace("\\-", "-")
    page_content = page_content.replace("\\+", "+")
    page_content = page_content.replace("\\.", ".")

    lines = []
    for line in page_content.split("\n"):
        lines.append( line.strip() )
    page_content = "\n".join( lines )

    page_content = re.sub( r"\n{3,}", "\n\n", page_content )
    page_content = re.sub( r"\r\n", "\n", page_content )


    # Replace table
    soup = BeautifulSoup( page_content, 'html.parser' )
    table_tags = soup.select('table')
    for table_tag in table_tags:
        header_rows = 0
        for row in table_tag.find_all('tr'):
            if len( row.find_all('td') ) > 0:
                break

            header_rows += 1

        # Extract table header
        header = []
        for row in table_tag.find_all('tr')[ 0 : header_rows ]:
            header.append([ cell.get_text( strip = True ) for cell in row.find_all('th') ])

        # Extract table rows
        rows = []
        for row in table_tag.find_all('tr')[ header_rows : ]:
            rows.append([ cell.get_text( strip = True ) for cell in row.find_all(['td', 'th']) ])

        # Convert the table to Markdown
        markdown_table = tabulate( rows, header, tablefmt = "grid" )

        table_tag.replace_with( markdown_table )

    page_content = str( soup )

    return {
        'title': doc.title(),
        'markdown': page_content,
        'pages': markdown_to_pages( page_content, minimal_number_of_words ),
        'pages_v2': markdown_to_pages_recursive( page_content, minimal_number_of_words ),
    }

token_encoding = tiktoken.encoding_for_model( OPENAI_EMBEDDING )

def split_to_small_blocks( text, token_limit = 1024 ):
    block = ""
    blocks = []
    for line in text.strip().split("\n"):
        line_nl = "\n" + line
        if len( token_encoding.encode( ( block + line_nl ).strip() ) ) > token_limit:
            if block.strip() != "":
                blocks.append( block.strip() )

            block = ""

        block += line_nl

    if block.strip() != "":
        blocks.append( block.strip() )

    return blocks

def get_pages_with_token_limit( pages, token_limit = 1024 ):
    new_pages = []
    for page in pages:
        blocks = split_to_small_blocks( page['text'], token_limit )
        if len( blocks ) > 1:
            for text in blocks:
                new_page = copy.deepcopy( page )
                new_page['text'] = text

                new_pages.append( new_page )

        elif len( blocks ) == 1:
            new_pages.append( page )

    return new_pages

def markdown_to_pages( page_content, minimal_number_of_words = 8 ):
    if page_content == None or page_content.strip() == "":
        return []

    separator = "\n\n"

    page_content = re.sub( r"\n{3,}", separator, page_content ).strip()
    blocks = re.split( separator + '(?=#{1,4}\s+?)', page_content )
    del page_content

    if len( blocks ) == 0:
        return []

    pages = []
    for block in blocks:
        text = block.strip()
        if text != '':
            stripped_link = text
            stripped_link = re.sub( r"!?\[([^]]+?)\]\([^)]+?\)", r'\1', stripped_link ) # image or empty links
            stripped_link = re.sub( r"^#+?[^\n]+?(?:\n|$)", '', stripped_link ).strip()
            stripped_link = re.sub( r"\W+", ' ', stripped_link ).strip()
            stripped_words_count = len( stripped_link.split(' ') )
            if stripped_words_count >= minimal_number_of_words:
                pages.append({
                    'text': text,
                    'stripped_link': stripped_link,
                    'stripped_words_count': stripped_words_count,
                })

            del stripped_link

        del text

    del blocks

    return pages

def markdown_to_pages_recursive( page_content, minimal_number_of_words = 8, header = 1 ):
    if page_content == None or page_content.strip() == "":
        return []

    separator = "\n\n"

    page_content = re.sub( r"\n{3,}", separator, page_content ).strip()
    if (
        header >= 7
        or "#" * header not in page_content
    ):
        return [
            { 'text': page_content }
        ]

    blocks = re.split( separator + '(?=#{1,' + str( header ) + '}\s+?)', page_content )
    del page_content

    if len( blocks ) == 0:
        return []

    groupped_blocks = []
    groupped_block = ""
    for block in blocks:
        check_groupped_block = groupped_block.strip()
        check_groupped_block = re.sub( r"\n{2,}", "\n", check_groupped_block ).strip()
        if len( check_groupped_block.split("\n") ) >= 7:
            groupped_blocks.append( groupped_block )
            groupped_block = ""

        groupped_block += separator + block

    if groupped_block != "":
        groupped_blocks.append( groupped_block )
        groupped_block = ""

    pages = []
    for i, block in enumerate( groupped_blocks ):
        text = block.strip()
        if text != '':
            stripped_link = text
            stripped_link = re.sub( r"!?\[([^]]+?)\]\([^)]+?\)", r'\1', stripped_link ) # image or empty links
            stripped_link = re.sub( r"^#+?[^\n]+?(?:\n|$)", '', stripped_link ).strip()
            stripped_link = re.sub( r"\W+", ' ', stripped_link ).strip()
            stripped_words_count = len( stripped_link.split(' ') )
            if stripped_words_count >= minimal_number_of_words:
                for page in markdown_to_pages_recursive( text, minimal_number_of_words, header + 1 ):
                    pages.append( page )

            del stripped_link

        del text

    del blocks

    return pages