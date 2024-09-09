import re

START_OF_LIST_LINE = r"^(\s*)([-+*]|\d+\.)"

def calculate_nesting(line):
    match = re.match( START_OF_LIST_LINE , line)
    if match:
        return len(match.group(1))
    else:
        return -1


def md_list_to_values_list(markdown_list, current_nesting = 0):

    if isinstance(markdown_list, str):
      markdown_list = markdown_list.split("\n")
    result = []

    while 0 < len(markdown_list):
      nesting = calculate_nesting( markdown_list[0] )
      if nesting < current_nesting and nesting != -1:
        # print( "go up ")
        return (result, markdown_list)

      if nesting > current_nesting:
        # print( "go down ")
        child, markdown_list = md_list_to_values_list( markdown_list, current_nesting + 1 )
        result.append( child )
        continue
        
      clean_line = markdown_list.pop( 0 ).strip()
      if -1 == nesting and 0 < len( result ):
        # print( "append prew ", clean_line)
        result[-1] = result[-1] + "\n" + clean_line
      else:
        # print( "append new ", clean_line)
        result.append( clean_line )
    
    if 0 < current_nesting:
      # print( "back 2")
      return (result, [])
    
    return result

def values_list_to_md_list(lst, level=0):
    markdown = ""
    for item in lst:
        if isinstance(item, list):
            markdown += values_list_to_md_list(item, level + 1)
        else:
            if not re.match( START_OF_LIST_LINE , item) and 0 < len( item ):
              item = "- " + item

            indent = "  " * level
            markdown += indent + item + "\n"
    return markdown

markdown_for_test = """
- Item 1
 - Subitem 1.1
Subitem 1.2
  * Subsubitem 1.2.1
 - Item 2
"""