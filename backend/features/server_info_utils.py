import socket
import aiohttp
from ipwhois import IPWhois
import asyncio

async def get_server_info(url):
    try:
        # Get the IP address of the server
        ip_address = socket.gethostbyname(url)
        
        # Get WHOIS information
        obj = IPWhois(ip_address)
        res = await asyncio.get_event_loop().run_in_executor(None, obj.lookup_rdap)

        # Extract relevant information
        asn = res.get('asn', 'N/A')
        org = res.get('network', {}).get('name', 'N/A')
        country = res.get('network', {}).get('country', 'N/A')
        network_range = res.get('network', {}).get('cidr', 'N/A')
        isp_info = res.get('asn_description', 'N/A')

        server_info = {
            'Organization': org,
            'ASN Code': asn,
            'IP': ip_address,
            'ISP': isp_info,
            'Network Range': network_range,
            'Country': country
        }

        # Get HTTP headers asynchronously
        async with aiohttp.ClientSession() as session:
            async with session.get(f"http://{url}") as response:
                headers = response.headers
                server_type = headers.get('Server', 'N/A')
                content_type = headers.get('Content-Type', 'N/A')

        # Combine all info
        server_info['Server Type'] = server_type
        server_info['Content Type'] = content_type

        return server_info
    except Exception as e:
        raise Exception(f"Error retrieving information for {url}: {e}")
