import aiohttp

async def check_firewall(url):
    """
    Check if the website is protected by a firewall (WAF) and detect the WAF provider.
    """
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                headers = response.headers
                waf_providers = {
                    "cloudflare": "Cloudflare",
                    "sucuri/cloudproxy": "Sucuri",
                    "incapsula": "Imperva Incapsula",
                    "akamai": "Akamai",
                    "f5": "F5 Networks",
                    "barracuda": "Barracuda Networks",
                    "mod_security": "ModSecurity",
                    "wallarm": "Wallarm"
                }

                # Identify the WAF provider by analyzing common headers
                for header in headers:
                    header_value = headers[header].lower()
                    for waf_keyword, waf_name in waf_providers.items():
                        if waf_keyword in header_value:
                            return True, waf_name

                # If no WAF was detected, return False
                return False, "Unknown"

    except Exception as e:
        return False, f"Error checking firewall: {e}"

async def display_firewall_info(url):
    """
    Display firewall (WAF) information for the given website.
    """
    firewall_exists, waf_provider = await check_firewall(url)  # Await the async check_firewall

    # Format output
    result = {
        "Firewall": "✅ Yes" if firewall_exists else "❌ No",
        "WAF": waf_provider if firewall_exists else "N/A"
    }
    return result
