import os
import json
import time
import datetime
import pandas as pd
import numpy as np
import requests
import copy

from notion_client import Client


TYPE_DATABASE = "database"
TYPE_PAGE = "page"

def scrape_database(client, database_id):
    json_descr = client.databases.retrieve(database_id=database_id)
    json_data = client.databases.query(database_id=database_id)

    json_data = expand_toggle(client, json_data)

    return {
        'Type': TYPE_DATABASE,
        'url': 'https://www.notion.so/' + database_id.replace('-', ''),
        'id': database_id,
        'Description': json_descr,
        'Data': json_data
    }


def scrape_page(client, page_id, t=TYPE_PAGE):
    json_data = client.blocks.children.list(block_id=page_id)
    json_data = expand_toggle(client, json_data)

    return {
        'Type': t,
        'url': 'https://www.notion.so/' + page_id.replace('-', ''),
        'id': page_id,
        'Data': json_data
    }


def find_key(json_data, target_key, path=None, target_value=None):
    if path is None:
        path = []

    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if target_value:
                cond = (key == target_key) and (value == target_value)
            else:
                cond = (key == target_key)
            if cond:
                yield path + [key]
            else:
                yield from find_key(value, target_key, path + [key], target_value)
    elif isinstance(json_data, list):
        for index, item in enumerate(json_data):
            yield from find_key(item, target_key, path + [index], target_value)


def expand_toggle(client, initial_obj):

    paths = []
    children = []

    for k in find_key(initial_obj, 'toggle'):
        paths.append(k)

    for p in paths:

        obj = initial_obj[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': 'toggle', 'id': obj['id'], 'path': p})

    paths = []

    for k in find_key(initial_obj, 'table'):
        paths.append(k)

    for p in paths:

        obj = initial_obj[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': 'table', 'id': obj['id'], 'path': p})

    for k in find_key(initial_obj, 'column_list'):
        paths.append(k)

    for p in paths:

        obj = initial_obj[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': 'column_list', 'id': obj['id'], 'path': p})

    for k in find_key(initial_obj, 'column'):
        paths.append(k)

    for p in paths:

        obj = initial_obj[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': 'column', 'id': obj['id'], 'path': p})

    #     print(children)

    for c in children:

        child_obj = scrape_page(client, c['id'], t=c['Type'])
        current_level = initial_obj
        for key in c['path'][:-1]:
            current_level = current_level[key]
        current_level[c['path'][-1]] = [current_level[c['path'][-1]], child_obj]

    return initial_obj


def find_children_ids(json):
    children = []

    paths = []

    for k in find_key(json, 'child_page'):
        paths.append(k)

    for p in paths:

        obj = json[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': TYPE_PAGE, 'id': obj['id'], 'path': p})

    for k in find_key(json, 'object', target_value=TYPE_PAGE):
        paths.append(k)

    for p in paths:

        obj = json[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': TYPE_PAGE, 'id': obj['id'], 'path': p})

    paths = []

    for k in find_key(json, 'child_database'):
        paths.append(k)

    for p in paths:

        obj = json[p[0]]

        for p1 in p[1:-1]:
            obj = obj[p1]

        children.append({'Type': TYPE_DATABASE, 'id': obj['id'], 'path': p})

    return children


def add_children(client, initial_obj, exclude_pages=[], children_old=[]):
    children_new = find_children_ids(initial_obj)

    children_add = [c for c in children_new if not c in children_old]

    print(len(children_add), ' new potential children')

    children_objs = []

    for c in children_add:

        if not c['id'] in exclude_pages:

            if c['Type'] == TYPE_DATABASE:
                try:
                    child_obj = scrape_database(client, c['id'])
                except:
                    child_obj = scrape_page(client, c['id'])
            else:
                child_obj = scrape_page(client, c['id'], t=c['Type'])

            children_objs.append(child_obj)

    return children_objs, children_new


def scrape_notion(task_config):
    if task_config['auth']['token']:
        client = Client(auth=task_config['auth']['token'])
    else:
        raise NotImplementedError

    scraped_pages = []
    scraped_page_meta = {}

    all_scraped_pages = []
    for item in client.search()['results']:
        id = item['id'].replace('-', '')
        all_scraped_pages.append( id )
        scraped_page_meta[ id ] = item

    for i in range(len(task_config['exclude_pages'])):
        task_config['exclude_pages'][i] = task_config['exclude_pages'][i].replace('-', '')

    if not task_config['n_levels']:
        task_config['n_levels'] = 1000

    pages = []
    if isinstance( task_config['pages'], list ):
        pages = [ id for id in task_config['pages'] if id in all_scraped_pages ]

    elif isinstance( task_config['pages'], str ) and task_config['pages'] == 'AUTO':
        pages = all_scraped_pages

    for i1, obj_id in enumerate( pages ):
        print('Scraping page', i1)

        if not obj_id.replace('-', '') in task_config['exclude_pages']:

            try:
                obj = scrape_database(client, obj_id)
            except:
                obj = scrape_page(client, obj_id)

            scraped_pages.append(obj)

            children = []
            children_new = [1]

            to_scrape = [obj]

            for i in range(task_config['n_levels']):

                if len(children_new) != len(children):
                    print('Scraping level ', i + 1)
                    children_objs = []
                    for p in to_scrape:
                        children = copy.deepcopy(children_new)
                        children_objs_s, children_new = add_children(client, p, task_config['exclude_pages'], children)
                        children_objs += children_objs_s
                    print('Found ', len(children_objs), 'children objects')
                    to_scrape = copy.deepcopy(children_objs)
                    scraped_pages += children_objs

    return scraped_pages, scraped_page_meta