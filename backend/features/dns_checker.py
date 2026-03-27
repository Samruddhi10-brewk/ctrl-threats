import dns.resolver
import requests
import asyncio
import logging

async def get_dns_servers(domain):
    """
    Perform a DNS lookup to retrieve the nameservers (DNS servers) for the domain.
    """
    try:
        dns_servers = dns.resolver.resolve(domain, 'NS')
        return [str(server).strip('.') for server in dns_servers]
    except Exception as e:
        return f"Error fetching DNS servers: {e}"

async def check_doh_support(dns_ip):
    """
    Check if the DNS server supports DNS over HTTPS (DoH).
    """
    doh_endpoints = [
        f"https://{dns_ip}/dns-query",  # Standard DoH URL format
        "https://cloudflare-dns.com/dns-query",  # Cloudflare DoH example
        "https://dns.google/dns-query"  # Google DoH example
    ]
    headers = {"Accept": "application/dns-json"}

    for endpoint in doh_endpoints:
        try:
            response = requests.get(endpoint, headers=headers, timeout=5)
            if response.status_code == 200:
                return True
        except Exception:
            continue
    return False

async def display_dns_server_info(domain):
    """
    Display DNS server info: DNS servers and their DoH support status.
    """
    dns_servers = await get_dns_servers(domain)  # Await this async function

    if isinstance(dns_servers, list):
        output = []
        for i, dns_server in enumerate(dns_servers, 1):
            # Assuming DNS server IPs are extracted from the NS (nameservers) lookup
            try:
                ip_address = dns.resolver.resolve(dns_server, 'A')[0].to_text()
            except Exception as e:
                ip_address = "Unable to resolve IP"

            # Check DoH Support
            doh_support = await check_doh_support(ip_address)  # Await DoH check
            doh_status = "✅ Yes" if doh_support else "❌ No*"

            # Add DNS server info to the output
            output.append({
                "DNS Server": f"#{i}",
                "IP Address": ip_address,
                "DoH Support": doh_status
            })
        
        output.append({
            "note": "* DoH Support is determined by the DNS server's response to a DoH query. If the DNS server does not support DoH, it may still be possible to use DoH by using a DoH proxy."
        })
        
        return output  # Return the output as a JSON serializable structure

    else:
        return {"error": dns_servers}  # If there's an error with DNS resolution
