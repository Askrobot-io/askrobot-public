from bs4 import BeautifulSoup
import notion2md
from notion2md.convertor.block import BlockConvertor


def page2markdown(json_data):
    n2md = MyBlockConvertor(config={}, client=None)

    md = n2md.convert(blocks=json_data['Data']['results'])

    soup = BeautifulSoup(md, 'html.parser')

    # Remove all "span" tags
    for tag in soup.find_all('span'):
        tag.decompose()

    # Remove all "br" tags
    for tag in soup.find_all('br'):
        tag.decompose()

    cleaned_markdown = str(soup)

    return cleaned_markdown


def process_child_page(block):
    url = 'https://www.notion.so/' + block['id'].replace('-', '')
    if block['child_page']['title'] == '':
        block['child_page']['title'] = 'Untitled'
    md_text = '[' + block['child_page']['title'] + '](' + url + ')'

    return '\n' + md_text + '\n\n'

def process_child_database(block):
    url = 'https://www.notion.so/' + block['id'].replace('-', '')
    if block['child_database']['title'] == '':
        block['child_database']['title'] = 'Untitled'
    md_text = '[' + block['child_database']['title'] + '](' + url + ')'

    return '\n' + md_text + '\n'

def my_text_link(item: dict):
    """
    input: item:dict ={"content":str,"link":str}
    """
    if item['link']['url'].count('/') < 2:
        link = 'https://www.notion.so'+item['link']['url']
    else:
        link = item['link']['url']

    return f"[{item['content']}]({link})"

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
    "synced_block": notion2md.convertor.block.synced_block,
}


class MyBlockConvertor(BlockConvertor):

    def convert_block(self, block: dict, depth=0) -> str:
        outcome_block: str = ""
        block_type = block["type"]
        if block_type == "toggle":
            try:
                outcome_block = (
                        "▼" + BLOCK_TYPES["paragraph"](
                    self.collect_info(block[block_type][0])
                )
                        + "\n\n" + self.convert(block[block_type][1]['Data']['results']) + '\n')
                return outcome_block
            except:
                print(block)
        elif block_type == 'column_list':
            outcome_block = ''
            for b in block[block_type][1]['Data']['results']:
                b1 = b['column'][1]['Data']['results']
                outcome_block += self.convert(b1) + '\n\n'
            return outcome_block
        elif block_type == 'child_database':
            return process_child_database(block)
        elif block_type == 'child_page':
            return process_child_page(block)
        elif block_type == "table":
            try:
                outcome_block = '\n' + self.create_table(cell_blocks=block[block_type][1]['Data']['results']) + '\n'
                return outcome_block
            except:
                print(block)
        elif block_type == "numbered_list_item":
            if self._continued_numbered_list:
                self._numbered_list_number += 1
            else:
                self._continued_numbered_list = True
                self._numbered_list_number = 1
        else:
            self._continued_numbered_list = False
        # Special Case: Block is blank
        if (
                block_type == "paragraph"
                and not block["has_children"]
                and not block[block_type]["rich_text"]
        ):
            return notion2md.convertor.block.blank() + "\n\n"
        # Normal Case
        try:
            if block_type in BLOCK_TYPES:
                outcome_block = (
                        BLOCK_TYPES[block_type](
                            self.collect_info(block[block_type])
                        )
                        + "\n\n"
                )
            else:
                outcome_block = f"[//]: # ({block_type} is not supported)\n\n"
            # Convert child block

        except Exception as e:
            if self._io:
                self._io.write_line(
                    error(f"{e}: Error occured block_type:{block_type}")
                )
        return outcome_block

    def create_table(self, cell_blocks: dict):
        table_list = []
        for cell_block in cell_blocks:
            cell_block_type = cell_block["type"]
            table_list.append(
                BLOCK_TYPES[cell_block_type](
                    self.collect_info(cell_block[cell_block_type])
                )
            )
        # convert to markdown table
        for index, value in enumerate(table_list):
            if index == 0:
                table = (" | " + " | ".join(value) + " | ").replace('\n', '') + "\n"
                table += (
                        " | " + " | ".join(["----"] * len(value)) + " | " + "\n"
                )
                continue
            table += (" | " + " | ".join(value) + " | ").replace('\n', '') + "\n"
        table += "\n"
        return table