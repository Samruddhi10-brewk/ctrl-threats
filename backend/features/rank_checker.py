import os
import aiohttp

async def rank_handler(url):
    """
    Fetch the rank of the given URL from the Tranco API asynchronously.
    """
    domain = url.split("//")[-1].split("/")[0]  # Extract domain from the URL
    if not domain:
        raise ValueError('Invalid URL')

    try:
        # Prepare authentication if provided
        auth = (os.getenv('TRANCO_USERNAME'), os.getenv('TRANCO_API_KEY')) if os.getenv('TRANCO_API_KEY') else None

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f'https://tranco-list.eu/api/ranks/domain/{domain}',
                auth=auth,
                timeout=5
            ) as response:
                response.raise_for_status()  # Raise an error for bad responses
                data = await response.json()  # Await the response and decode the JSON

                if not data or 'ranks' not in data or len(data['ranks']) == 0:
                    return {'skipped': f'Skipping, as {domain} isn\'t ranked in the top 100 million sites yet.'}

                return data
    except Exception as e:
        return {'error': f'Unable to fetch rank, {str(e)}'}
