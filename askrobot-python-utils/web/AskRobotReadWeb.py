import os
import sys

SCRIPT_DIR = os.path.realpath( os.path.dirname( __file__ ) )

import gc
import asyncio
import hashlib
import nest_asyncio
from playwright.async_api import async_playwright

import logging
for module in [
    'nest_asyncio',
    'playwright',
]:
    logging.getLogger( module ).setLevel( logging.WARNING )
    logging.getLogger( module ).propagate = False



#
# INIT
#
nest_asyncio.apply()



#
# LIB
#
WEB_CACHE_DIR = f"{SCRIPT_DIR}/cache"

class AskRobotReadWeb:
    def __init__( self, url ):
        self.url = url

        filename_md5 = hashlib.md5( url.encode('utf-8') ).hexdigest()
        self.cache_filename = WEB_CACHE_DIR + "/" + filename_md5 + ".html"


    def get_page_content( self ):
        if os.path.exists( self.cache_filename ):
            with open( self.cache_filename ) as f:
                return f.read()

        async def main():
            async with async_playwright() as playwright:
                browser = await playwright.chromium.launch()
                context = await browser.new_context()
                page = await context.new_page()

                await page.goto( self.url )
                await page.wait_for_load_state('networkidle')
                content = await page.content()
                await browser.close()

                del browser
                del context
                del page
                gc.collect()

                with open( self.cache_filename, 'w' ) as f:
                    f.write( content )

                return content

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        return loop.run_until_complete(main())