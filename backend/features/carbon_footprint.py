import aiohttp
import os
import asyncio

# Normalize the URL to include https if not present
def normalize_url(url):
    return url if url.startswith('http') else f"https://{url}"

# Timeout settings (in seconds)
TIMEOUT = int(os.getenv('API_TIMEOUT_LIMIT', 60))  # Default is 60 seconds

# Function to get the size of the website's HTML
async def get_html_size(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=TIMEOUT) as response:
                response.raise_for_status()  # Raise an error for bad status codes
                html_content = await response.text()
                size_in_bytes = len(html_content.encode('utf-8'))  # Get size in bytes
                return size_in_bytes
    except asyncio.TimeoutError:
        raise Exception(f"Request to {url} timed out after {TIMEOUT * 1000} ms")
    except aiohttp.ClientError as e:
        raise Exception(f"Error retrieving HTML size for {url}: {str(e)}")

# Function to get carbon data based on the HTML size
async def get_carbon_data(url):
    try:
        # Normalize the URL to ensure it starts with https
        url = normalize_url(url)

        # Get the size of the website's HTML
        size_in_bytes = await get_html_size(url)

        # Use the size to fetch carbon data from the API
        api_url = f"https://api.websitecarbon.com/data?bytes={size_in_bytes}&green=0"
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url, timeout=TIMEOUT) as response:
                response.raise_for_status()  # Raise error for non-200 responses
                carbon_data = await response.json()

        # Check if the API returned valid carbon data
        if not carbon_data.get('statistics') or (
            carbon_data['statistics']['adjustedBytes'] == 0 and carbon_data['statistics']['energy'] == 0):
            return {"skipped": "Not enough info to get carbon data"}

        # Add the scan URL to the returned data
        carbon_data['scanUrl'] = url
        return carbon_data
    except asyncio.TimeoutError:
        raise Exception(f"Request timed out after {TIMEOUT * 1000} ms")
    except aiohttp.ClientError as e:
        raise Exception(f"Error in get_carbon_data: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")
