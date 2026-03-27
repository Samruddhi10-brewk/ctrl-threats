import aiohttp
from bs4 import BeautifulSoup

async def social_tags_handler(url):
    # Check if the URL includes a protocol
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                response.raise_for_status()  # Raise an error for bad responses
                html = await response.text()  # Await the response text
                soup = BeautifulSoup(html, 'html.parser')

                metadata = {
                    # Basic meta tags
                    'title': soup.title.string if soup.title else '',
                    'description': (soup.find('meta', attrs={'name': 'description'}) or {}).get('content', ''),
                    'keywords': (soup.find('meta', attrs={'name': 'keywords'}) or {}).get('content', ''),
                    'canonicalUrl': (soup.find('link', attrs={'rel': 'canonical'}) or {}).get('href', ''),

                    # OpenGraph Protocol
                    'ogTitle': (soup.find('meta', attrs={'property': 'og:title'}) or {}).get('content', ''),
                    'ogType': (soup.find('meta', attrs={'property': 'og:type'}) or {}).get('content', ''),
                    'ogImage': (soup.find('meta', attrs={'property': 'og:image'}) or {}).get('content', ''),
                    'ogUrl': (soup.find('meta', attrs={'property': 'og:url'}) or {}).get('content', ''),
                    'ogDescription': (soup.find('meta', attrs={'property': 'og:description'}) or {}).get('content', ''),
                    'ogSiteName': (soup.find('meta', attrs={'property': 'og:site_name'}) or {}).get('content', ''),

                    # Twitter Cards
                    'twitterCard': (soup.find('meta', attrs={'name': 'twitter:card'}) or {}).get('content', ''),
                    'twitterSite': (soup.find('meta', attrs={'name': 'twitter:site'}) or {}).get('content', ''),
                    'twitterCreator': (soup.find('meta', attrs={'name': 'twitter:creator'}) or {}).get('content', ''),
                    'twitterTitle': (soup.find('meta', attrs={'name': 'twitter:title'}) or {}).get('content', ''),
                    'twitterDescription': (soup.find('meta', attrs={'name': 'twitter:description'}) or {}).get('content', ''),
                    'twitterImage': (soup.find('meta', attrs={'name': 'twitter:image'}) or {}).get('content', ''),

                    # Misc
                    'themeColor': (soup.find('meta', attrs={'name': 'theme-color'}) or {}).get('content', ''),
                    'robots': (soup.find('meta', attrs={'name': 'robots'}) or {}).get('content', ''),
                    'googlebot': (soup.find('meta', attrs={'name': 'googlebot'}) or {}).get('content', ''),
                    'generator': (soup.find('meta', attrs={'name': 'generator'}) or {}).get('content', ''),
                    'viewport': (soup.find('meta', attrs={'name': 'viewport'}) or {}).get('content', ''),
                    'author': (soup.find('meta', attrs={'name': 'author'}) or {}).get('content', ''),
                    'publisher': (soup.find('link', attrs={'rel': 'publisher'}) or {}).get('href', ''),
                    'favicon': (soup.find('link', attrs={'rel': 'icon'}) or {}).get('href', '')
                }

                if not any(metadata.values()):
                    return {'skipped': 'No metadata found'}
                return metadata

        except aiohttp.ClientError:
            return {
                'statusCode': 500,
                'body': {'error': 'Failed fetching data'},
            }
