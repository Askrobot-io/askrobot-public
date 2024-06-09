import re
import notion2md
from tabulate import tabulate
from bs4 import BeautifulSoup
from notion2md.convertor.block import BlockConvertor


def page2markdown( page ):
    n2md = MyBlockConvertor( config={}, client = None )

    md = n2md.convert( blocks = page['Data']['results'] )

    soup = BeautifulSoup(md, 'html.parser')
    for tag_name in ['span', 'u', 'br']:
        for tag in soup.find_all( tag_name ):
            tag.unwrap()
    cleaned_markdown = str( soup )

    cleaned_markdown = cleaned_markdown.replace('&amp;', '&')
    return re.sub( r"\n{3,}", "\n\n", cleaned_markdown )

def my_text_link( block ):
    """
    input: block : dict = {"content": str, "link": str}
    """

    title = block['content'].strip()
    link = block['link']['url'].strip()
    url = f"https://www.notion.so{link}" if link.count('/') < 2 else link
    if url != "" and title != "":
        return f"[{title}]({url})"
    return ""

notion2md.convertor.richtext.text_link = my_text_link

BLOCK_TYPES = {
    "paragraph": notion2md.convertor.block.paragraph,
    "heading_1": notion2md.convertor.block.heading_1,
    "heading_2": notion2md.convertor.block.heading_2,
    "heading_3": notion2md.convertor.block.heading_3,
    "callout": notion2md.convertor.block.callout,
    "toggle": notion2md.convertor.block.bulleted_list_item,
    "quote": notion2md.convertor.block.quote,
    "bulleted_list_item": notion2md.convertor.block.bulleted_list_item,
    "numbered_list_item": notion2md.convertor.block.numbered_list_item,
    "to_do": notion2md.convertor.block.to_do,
    # "child_page": child_page,
    "code": notion2md.convertor.block.code,
    "embed": notion2md.convertor.block.embed,
    "image": notion2md.convertor.block.image,
    "bookmark": notion2md.convertor.block.bookmark,
    "equation": notion2md.convertor.block.equation,
    "divider": notion2md.convertor.block.divider,
    "file": notion2md.convertor.block.file,
    "table_row": notion2md.convertor.block.table_row,
    # "synced_block": notion2md.convertor.block.synced_block,
}


class MyBlockConvertor( BlockConvertor ):
    def __init__( self, config, client, io = None ):
        self._continued_numbered_list_hash = {}
        self._numbered_list_number_hash = {}
        super().__init__( config, client, io )

    def convert_block( self, block: dict, depth = 0 ) -> str:
        outcome_block = ""
        block_type = block["type"] if 'type' in block else None
        if block_type == None:
            return outcome_block

        try:
            # [Testing env]
            # outcome_block += f"[{block_type}]\n"
            # outcome_block += f"{block = }\n"

            if block_type == 'toggle':
                outcome_block += "▼ "

            if block_type == 'numbered_list_item':
                if self._continued_numbered_list:
                    self._numbered_list_number += 1

                else:
                    self._continued_numbered_list = True
                    self._numbered_list_number = 1

            else:
                self._continued_numbered_list = False

            if block_type in ['child_page', 'child_database', 'link_to_page']:
                url = f"https://www.notion.so/{block['id']}"
                if (
                    'url' in block
                    and block['url'] != None
                    and block['url'].strip() != ""
                ):
                    url = block['url'].strip()

                title = ""
                if (
                    block_type in block
                    and 'title' in block[ block_type ]
                    and block[ block_type ]['title'] != None
                    and block[ block_type ]['title'].strip() != ""
                ):
                    title = block[ block_type ]['title'].strip()

                if url != "":
                    if title != "":
                        outcome_block += f"[{title}]({url})"

                    else:
                        outcome_block += url

            elif block_type in ['table']:
                outcome_block = '\n' + self.create_table( cell_blocks = block[ block_type ]['results'] ) + '\n'

            elif 'url' in block and block['url'] != None:
                if (
                    block_type in block
                    and block[ block_type ] != None
                    and 'results' in block[ block_type ]
                    and len( block[ block_type ]['results'] ) > 0
                ):
                    for b in block[ block_type ]['results']:
                        outcome_block += self.convert_block( b, depth + 1 ) + '\n\n'

            elif (
                block_type in block
                and (
                    len( block[ block_type ] ) == 0
                    or
                    block_type == 'synced_block'
                    and len( block['synced_block'] ) == 1
                    and 'synced_from' in block['synced_block']
                    and block['synced_block']['synced_from'] == None
                )
            ):
                # skip empty blocks
                pass

            elif block_type in ['image', 'video', 'file']:
                url = block[ block_type ][ block[ block_type ]['type'] ]['url'].strip()

                title = ""
                if (
                    block_type in block
                    and 'caption' in block[ block_type ]
                    and len( block[ block_type ]['caption'] ) > 0
                    and 'plain_text' in block[ block_type ]['caption'][0]
                    and block[ block_type ]['caption'][0]['plain_text'] != None
                    and block[ block_type ]['caption'][0]['plain_text'].strip() != ""
                ):
                    title = block[ block_type ]['caption'][0]['plain_text'].strip()

                elif (
                    block_type in block
                    and 'name' in block[ block_type ]
                    and block[ block_type ]['name'] != None
                    and block[ block_type ]['name'].strip() != ""
                ):
                    title = block[ block_type ]['name'].strip()

                if url != "" and title != "":
                    outcome_block += f"![{title}]({url})"

                else:
                    outcome_block += url

            elif block_type == 'synced_block': # if there is only a link
                block_id = block['id']
                if (
                    'synced_block' in block
                    and block['synced_block'] != None
                    and 'synced_from' in block['synced_block']
                    and block['synced_block']['synced_from'] != None
                    and 'type' in block['synced_block']['synced_from']
                    and block['synced_block']['synced_from']['type'] == "block_id"
                    and 'block_id' in block['synced_block']['synced_from']
                    and block['synced_block']['synced_from']['block_id'] != None
                ):
                    block_id = block['synced_block']['synced_from']['block_id']

                url = f"https://www.notion.so/{block_id}"
                outcome_block += url

            elif block_type in ['table_of_contents']:
                pass

            elif block_type in BLOCK_TYPES:
                outcome_block = (
                    BLOCK_TYPES[ block_type ](
                        self.collect_info( block[ block_type ] )
                    )
                    + "\n\n"
                )

            else:
                outcome_block += f"{block = }\n"
                outcome_block += f"[//]: # ({block_type} is not supported)\n\n"

        except Exception as e:
            print( "[x]", block_type, e )
            pprint( block )

        return outcome_block

    def create_table( self, cell_blocks ):
        table_list = []
        for cell_block in cell_blocks:
            cell_block_type = cell_block["type"]
            if cell_block_type in ['table_row']:
                table_list.append(
                    BLOCK_TYPES[ cell_block_type ](
                        self.collect_info( cell_block[ cell_block_type ] )
                    )
                )

        return tabulate( table_list, [], tablefmt = "grid" )
