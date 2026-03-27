import logging
from urllib.parse import urljoin
import urllib.request
from bs4 import BeautifulSoup



# Function to download favicon for a given domain
async def download_favicon(domain: str) -> bytes:
    try:
        # Fetch the webpage
        url = f"http://{domain}" if not domain.startswith("http") else domain
        page = urllib.request.urlopen(url)

        # Parse the webpage
        soup = BeautifulSoup(page, "html.parser")

        # Try to find the favicon link
        icon_link = soup.find("link", rel="icon") or soup.find("link", rel="shortcut icon")

        if icon_link and 'href' in icon_link.attrs:
            icon_url = icon_link['href']

            # Handle relative URLs
            if not icon_url.startswith("http"):
                icon_url = urljoin(url, icon_url)

            # Download the favicon
            icon = urllib.request.urlopen(icon_url)
            return icon.read()
        else:
            # Default favicon location
            default_favicon_url = urljoin(url, "/favicon.ico")
            icon = urllib.request.urlopen(default_favicon_url)
            return icon.read()

    except Exception as e:
        logging.error(f"Error downloading favicon for {domain}: {e}")
        raise Exception(f"Error downloading favicon for {domain}: {e}")