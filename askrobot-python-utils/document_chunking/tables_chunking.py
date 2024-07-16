MAX_TOKENS_PER_CHUNK = 500

import tiktoken

from tabulate import tabulate
enc = tiktoken.get_encoding("cl100k_base")

from document_chunking.md_list import md_list_to_values_list, values_list_to_md_list

def table_split(rows, header, max_tokens = MAX_TOKENS_PER_CHUNK):
    
    table_md_text = tabulate( rows, header, tablefmt = "grid" )

    table_md_tokens = enc.encode( table_md_text )
    table_md_tokens_count = len( table_md_tokens )
    if table_md_tokens_count < max_tokens:
        return table_md_text
    
    half_rows_len = len( rows ) // 2
    if half_rows_len < 1:
        return vertical_table_split( rows, header )
    
    # print( "horisontal tasble split ", half_rows_len )
    
    rows1 = rows[ : half_rows_len ]
    rows2 = rows[ half_rows_len : ]
    tables1 = table_split( rows1, header)
    tables2 = table_split( rows2, header)

    return f"{tables1}\n\n{tables2}"

def vertical_table_split(rows, header, max_tokens = MAX_TOKENS_PER_CHUNK):

    table_md_text = tabulate( rows, header, tablefmt = "grid" )
    table_md_tokens = enc.encode( table_md_text )
    table_md_tokens_count = len( table_md_tokens )
    if table_md_tokens_count < max_tokens:
        return table_md_text

    header_len = len( header )

    rows1 = []
    rows2 = []
    for row in rows:
        row_without_header = row[  : len( row ) - header_len ]
        row_with_header = row[ len( row ) - header_len : ]
        half_row_with_header_len  = len( row_with_header ) // 2
        if half_row_with_header_len < 1:
            rows1 = []
            rows2 = []
            break

        rows1.append( row_without_header + row_with_header[ : half_row_with_header_len ] )
        rows2.append( row_without_header + row_with_header[ half_row_with_header_len : ] )

    if len( rows1 ) < 1:
        return table_md_text
    
    
    # print( "vertical tasble split ", header_len // 2 )

    header1 = header[ : header_len // 2 ]
    header2 = header[ header_len // 2 : ]
    tables1 = vertical_table_split( rows1, header1 )
    tables2 = vertical_table_split( rows2, header2 )

    return f"{tables1}\n\n{tables2}"

'''
table view
       l1 l2 l3
v1 v11 1  2  3
v2 v22 4  5  6

list view
- l1
	- v1 v11
        -1
	- v2 v22
        -4
- l2
	- v1 v11 
        - 2
	- v2 v22 
        - 5
- l3
	- v1 v11 
        - 3
	- v2 v22 
        - 6

table data:
header = [ l1, l2, l3 ]
rows = [
	[ v1, v11, 1, 2, 3 ],
	[ v2, v22, 4, 5, 6 ]
       ]

list data: 
[   l1, 
        ["v1 v11", ["1"], "v2 v22", ["4"] ], 
    l2, 
        ["v1 v11", ["2"], "v2 v22", ["5"] ], 
    l3, 
        ["v1 v11", ["3"], "v2 v22", ["6"] ]
]
'''
def table_to_list_values(rows, header):
    
    flatten_header = [ str(subheader) for subheader in header ]
    
    # remove first empty headers
    cut_index = 0
    for header_col in flatten_header:
        if header_col.strip() != "":
             break
        cut_index += 1
    flatten_header = flatten_header[ cut_index : ]
    
    # main loop
    header_len = len( flatten_header )

    transpose = lambda x: list( map(list, zip(*x)) )

    columns = transpose( rows )

    columns_len = len( columns )
    columns_lables = columns[ 0 : columns_len - header_len ] # [ [v1, v2], [v11, v22] ]
    columns_values = columns[ columns_len - header_len : ] # [ [1, 4], [2, 5], [3, 6] ]

    rows_lables_list = transpose( columns_lables )  # [ [v1, v11], [v2, v22] ]
    rows_lables_strings = [ " ".join( row_lable_elem ) for row_lable_elem in rows_lables_list ] # [ "v1 v11", "v2 v22" ]
    # add lables to each row value
    for col_cells in columns_values: # transform to [ ["v1 v11", [1], "v2 v22", [4]], ["v1 v11", [2], "v2 v22", [5]], ["v1 v11", [3], "v2 v22", [6] ]
        for cel_num in range( len( col_cells ) ):
            cell_as_list = md_list_to_values_list( col_cells[ cel_num ] )
            col_cells[ cel_num ] = [ rows_lables_strings[ cel_num ], cell_as_list ]

    whole_list = []
    for col_cells, col_header in zip( columns_values, flatten_header ):
        whole_list.append(  col_header  )
        whole_list.extend( col_cells  )

    return whole_list

def table_to_list_md( rows, header ):
    list_as_values = table_to_list_values( rows, header )
    return values_list_to_md_list( list_as_values )


