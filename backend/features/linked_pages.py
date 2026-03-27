import aiohttp # type: ignore
from bs4 import BeautifulSoup
from urllib.parse import urljoin

async def linked_pages_handler(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                response.raise_for_status()  # Check if the request was successful
                html = await response.text()  # Await for the response text (html)

    except aiohttp.ClientError as e:
        return {
            'statusCode': 400,
            'body': {
                'error': str(e)
            }
        }

    soup = BeautifulSoup(html, 'html.parser')
    internal_links_map = {}
    external_links_map = {}

    # Get all links on the page
    for link in soup.find_all('a', href=True):
        href = link.get('href')
        absolute_url = urljoin(url, href)

        # Check if it's an internal or external link
        if absolute_url.startswith(url):
            internal_links_map[absolute_url] = internal_links_map.get(absolute_url, 0) + 1
        elif href.startswith(('http://', 'https://')):
            external_links_map[absolute_url] = external_links_map.get(absolute_url, 0) + 1

    # Sort by occurrences and convert to list
    internal_links = sorted(internal_links_map, key=internal_links_map.get, reverse=True)
    external_links = sorted(external_links_map, key=external_links_map.get, reverse=True)

    # If no links were found, return a skipped response
    if not internal_links and not external_links:
        return {
            'statusCode': 400,
            'body': {
                'skipped': 'No internal or external links found. '
                           'This may be due to the website being dynamically rendered, '
                           'using a client-side framework (like React) without SSR enabled. '
                           'Consider using a headless browser to render the page instead.'
            }
        }

    # Return the internal and external links
    return {
        'internal': internal_links,
        'external': external_links
    }
