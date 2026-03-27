import dns.asyncresolver
import asyncio
import logging

# Define DNS servers for block lists (remains unchanged)
dns_servers = {
    'AdGuard': '94.140.14.14',
    'AdGuard Family': '94.140.14.15',
    'CleanBrowsing Adult': '185.228.168.10',
    'CleanBrowsing Family': '185.228.168.168',
    'CleanBrowsing Security': '185.228.168.9',
    'CloudFlare': '1.1.1.1',
    'CloudFlare Family': '1.1.1.2',
    'Comodo Secure': '8.26.56.26',
    'Google DNS': '8.8.8.8',
    'Neustar Family': '156.154.70.3',
    'Neustar Protection': '156.154.70.1',
    'Norton Family': '199.85.126.30',
    'OpenDNS': '208.67.222.222',
    'OpenDNS Family': '208.67.222.123',
    'Quad9': '9.9.9.9',
    'Yandex Family': '77.88.8.7',
    'Yandex Safe': '77.88.8.3'
}

# Asynchronous function to resolve domain using specified DNS server with a timeout
async def check_blocked(domain, dns_server, timeout=10.0):
    resolver = dns.asyncresolver.Resolver()
    resolver.nameservers = [dns_server]
    resolver.lifetime = timeout  # Set the timeout (in seconds)
    try:
        # Attempt to resolve the URL using the specified DNS server
        await resolver.resolve(domain)  # Await the async resolve call
        return False  # Not blocked if resolution succeeds
    except dns.asyncresolver.NXDOMAIN:
        return True  # Blocked if NXDOMAIN is returned
    except Exception as e:
        logging.error(f"Error resolving {domain} with DNS server {dns_server}: {e}")
        return None  # Could not determine if blocked

# Asynchronous function to check blocklists and return the results
async def check_blocklists(domain):
    results = {}
    tasks = []

    # Check DNS Blocklists concurrently
    for dns_name, dns_ip in dns_servers.items():
        tasks.append(check_blocked(domain, dns_ip))

    # Gather the results from all tasks
    responses = await asyncio.gather(*tasks)

    for i, (dns_name, response) in enumerate(zip(dns_servers.keys(), responses)):
        if response is not None:
            status = "❌: Blocked" if response else "✅: Not Blocked"
        else:
            status = "Error/Undetermined"
        results[dns_name] = status

    return results
