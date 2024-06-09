import os
import json
import time
import datetime
import pandas as pd
import numpy as np
import requests
import copy

from notion_client import Client
import copy

TYPE_PAGE       = "page"
TYPE_CHILD_PAGE = "child_page"
TYPE_DATABASE   = "database"
TYPE_CALLOUT    = "callout"
TYPE_LINK_TO_PAGE = "link_to_page"

ALL_ATTACHMENT_TYPES = [
    TYPE_PAGE,
    TYPE_CHILD_PAGE,
    TYPE_CALLOUT,
    TYPE_LINK_TO_PAGE,
    TYPE_DATABASE,
]


#
# Globals
#
client = None
exclude_page_ids = []
page_hash = {}
page_meta_hash = {}
scrape_counter = 0
cache_hash = {}

def get_page( id, t = TYPE_PAGE ):
    return {
        'Type': t,
        'url':  f"https://www.notion.so/{id}",
        'id':   id,
        'Data': client.blocks.children.list( block_id = id )
    }

def get_database( id ):
    return {
        'Type':        TYPE_DATABASE,
        'url':         f"https://www.notion.so/{id}",
        'id':          id,
        'Description': client.databases.retrieve( database_id = id ),
        'Data':        client.databases.query( database_id = id ),
    }

def get_id( raw_id ):
    return raw_id.replace('-', '')

def get_title( meta ):
    if (
        'properties' in meta
        and 'Name' in meta['properties']
        and 'type' in meta['properties']['Name']
        and meta['properties']['Name']['type'] == "title"
        and 'title' in meta['properties']['Name']
        and meta['properties']['Name']['title'] != None
        and len( meta['properties']['Name']['title'] ) > 0
        and meta['properties']['Name']['title'][0] != None
        and 'plain_text' in meta['properties']['Name']['title'][0]
        and meta['properties']['Name']['title'][0]['plain_text'] != None
        and len( meta['properties']['Name']['title'][0]['plain_text'].strip() ) > 0
    ):
        return meta['properties']['Name']['title'][0]['plain_text'].strip()

    elif (
        'properties' in meta
        and 'title' in meta['properties']
        and meta['properties']['title']['type'] == "title"
        and 'title' in meta['properties']['title']
        and len( meta['properties']['title']['title'] ) > 0
        and 'plain_text' in meta['properties']['title']['title'][0]
        and meta['properties']['title']['title'][0]['plain_text'] != None
        and len( meta['properties']['title']['title'][0]['plain_text'].strip() ) > 0
    ):
        return meta['properties']['title']['title'][0]['plain_text'].strip()

    return ""

def is_expandable_block( block ):
    t = block['type'] if 'type' in block else None
    return (
        t != None
        and (
            t in [ TYPE_LINK_TO_PAGE ]
            or
            'has_children' in block and block['has_children']
            and ( 'in_trash' not in block or not block['in_trash'] )
        )
    )

def get_expandable_blocks_recursive( block ):
    if isinstance( block, dict ):
        if is_expandable_block( block ):
            yield block

        for key in block:
            yield from get_expandable_blocks_recursive( block[ key ] )

    elif isinstance( block, list ):
        for item in block:
            yield from get_expandable_blocks_recursive( item )

def get_extended_block_recursive( block ):
    global page_hash
    global page_meta_hash
    if isinstance( block, dict ):
        id = get_id( block['id'] ) if 'id' in block else None

        if (
            id != None
            and is_expandable_block( block )
            and block['type'] not in [ TYPE_CHILD_PAGE, TYPE_CALLOUT, TYPE_LINK_TO_PAGE ]
        ):
            original_block = copy.deepcopy( block )
            if id in page_hash:
                block.update( copy.deepcopy( page_hash[ id ] ) )

            # Expand block
            if 'Type' in block:
                t = block['Type']
                del block['Type']

                block['type'] = t
                if 'Data' in block:
                    block[ t ] = block['Data']
                    del block['Data']

                    original_block['has_children'] = False
                    if 'results' not in block[ t ]:
                        block[ t ]['results'] = []

                    block[ t ]['results'].insert( 0, original_block ) # add first

        # Expand children
        new_block = {}
        for key in block:
            new_block[ key ] = get_extended_block_recursive( block[ key ] )
        block.update( copy.deepcopy( new_block ) ) # replace

        # Add meta
        if (
            id != None
            and id in page_meta_hash
        ):
            page_meta = page_meta_hash[ id ]
            for key in ['public_url', 'url']:
                if key in page_meta:
                    block['url'] = page_meta[ key ]
                    break

    elif isinstance( block, list ):
        new_block = []
        for item in block:
            new_block.append( get_extended_block_recursive( item ) )
        block = copy.deepcopy( new_block ) # replace

    return block

def scrape_notion( task_config ):
    global client
    global exclude_page_ids
    global page_hash
    global page_meta_hash
    global scrape_counter

    # Reset
    client = None
    exclude_page_ids = []
    page_hash = {}
    page_meta_hash = {}
    scrape_counter = 0

    default_task_config = {
        'exclude_pages': [],
        'pages': 'AUTO'
    }

    task_config = dict( task_config )
    task_config = { **default_task_config, **task_config }

    if task_config['auth']['token']:
        client = Client( auth = task_config['auth']['token'] )

    else:
        raise NotImplementedError

    for item in client.search()['results']:
        page_meta_hash[ get_id( item['id'] ) ] = item

    exclude_page_ids = [ get_id( id ) for id in task_config['exclude_pages'] ]

    page_ids = []
    if isinstance( task_config['pages'], str ) and task_config['pages'] == 'AUTO':
        page_ids = list( page_meta_hash.keys() )

    elif isinstance( task_config['pages'], list ):
        page_ids = [ get_id( id ) for id in task_config['pages'] ]
        page_ids = [ id for id in page_ids if id in page_meta_hash ]

    pages = []
    page_ids = [ ( id, page_meta_hash[ id ]['object'] ) for id in page_ids ]
    for page, t in scrape_pages_recursive( page_ids ):
        if t in ALL_ATTACHMENT_TYPES:
            pages.append( page )

    extended_pages = [ get_extended_block_recursive( p ) for p in pages ]
    return extended_pages, page_meta_hash

def scrape_pages_recursive( page_ids, indent = 0 ):
    global exclude_page_ids
    global page_hash
    global scrape_counter
    global cache_hash

    for id, t in page_ids:
        if id in exclude_page_ids:
            continue

        exclude_page_ids.append( id ) # exclude from scraping

        if id not in cache_hash:
            try:
                page = get_database( id ) if t == TYPE_DATABASE else get_page( id, t )

            except Exception as e:
                print( scrape_counter, "  " * indent, "[x]", e )
                continue

            cache_hash[ id ] = ( page, t )

        page, t = copy.deepcopy( cache_hash[ id ] )
        if t != TYPE_DATABASE:
            page_hash[ id ] = page

        # Log
        scrape_counter += 1
        name = f"[{t}: {id}]"
        if id in page_meta_hash:
            name = get_title( page_meta_hash[ id ] ) + " " + name
        print( scrape_counter, "  " * indent, name )

        yield page, t

        sub_page_ids = []
        for b in get_expandable_blocks_recursive( page ):
            sub_page_ids.append( ( get_id( b['id'] ), b['type'] ) )

        yield from scrape_pages_recursive( sub_page_ids, indent + 1 )
