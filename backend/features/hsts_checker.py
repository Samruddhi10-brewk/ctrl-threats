import requests
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def check_hsts(url):
    """
    Check if HSTS is enabled and extract HSTS-related header values.
    """
    # Prepend 'https://' if no scheme is provided
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    loop = asyncio.get_event_loop()
    
    try:
        # Use run_in_executor to make the request asynchronously
        response = await loop.run_in_executor(None, requests.get, url, {'timeout': 10})

        # Check for the Strict-Transport-Security header
        hsts_header = response.headers.get('Strict-Transport-Security')

        if hsts_header:
            # Parse the HSTS header to extract max-age, includeSubDomains, and preload
            hsts_info = {
                'HSTS Enabled': True,
                'max-age': None,
                'includeSubDomains': False,
                'preload': False
            }

            # Split the header into components
            hsts_parts = hsts_header.split(';')

            for part in hsts_parts:
                part = part.strip().lower()

                if part.startswith('max-age'):
                    # Extract max-age value
                    max_age = part.split('=')[1]
                    hsts_info['max-age'] = int(max_age)

                if 'includesubdomains' in part:
                    # Check if includeSubDomains is present
                    hsts_info['includeSubDomains'] = True

                if 'preload' in part:
                    # Check if preload is enabled
                    hsts_info['preload'] = True

            return hsts_info
        else:
            return {'HSTS Enabled': False}

    except requests.exceptions.RequestException as e:
        return {'error': f"Error: Unable to check HSTS for {url}. {e}"}



async def format_hsts_report(url):
    """
    Format the HSTS check result as a structured JSON object.
    """
    hsts_info = await check_hsts(url)

    if isinstance(hsts_info, dict):
        # Add detailed compatibility information
        if hsts_info.get("HSTS Enabled"):
            hsts_info.update({
                "compatibility": {
                    "preload_ready": hsts_info.get("preload", False),
                    "notes": "Site is compatible with the HSTS preload list!" if hsts_info.get("preload") else "Site is not preloaded."
                }
            })
        return hsts_info
    else:
        return {
            "error": hsts_info
        }
