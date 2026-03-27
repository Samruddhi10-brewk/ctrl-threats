import logging
import dns.resolver
import asyncio

async def fetch_dns_records(domain):
    logging.info(f"Received request for DNS records of domain: {domain}")
    if domain:
        try:
            dns_info = await asyncio.get_event_loop().run_in_executor(None, get_dns_records, domain)
            logging.info(f"DNS records for {domain}: {dns_info}")
            return {
                'domain': domain,
                'dns_records': dns_info
            }
        except Exception as e:
            logging.error(f"Error retrieving DNS info for {domain}: {e}")
            return {'error': f"Error retrieving DNS info: {str(e)}"}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

def get_dns_records(domain):
    dns_info = {}

    # A record (IPv4)
    try:
        a_records = dns.resolver.resolve(domain, 'A')
        dns_info['A'] = [str(rdata) for rdata in a_records]
    except dns.resolver.NoAnswer:
        dns_info['A'] = 'No A records found'
    except Exception as e:
        dns_info['A'] = f"Error: {str(e)}"

    # AAAA record (IPv6)
    try:
        aaaa_records = dns.resolver.resolve(domain, 'AAAA')
        dns_info['AAAA'] = [str(rdata) for rdata in aaaa_records]
    except dns.resolver.NoAnswer:
        dns_info['AAAA'] = 'No AAAA records found'
    except Exception as e:
        dns_info['AAAA'] = f"Error: {str(e)}"

    # MX record (Mail Exchange)
    try:
        mx_records = dns.resolver.resolve(domain, 'MX')
        dns_info['MX'] = [str(rdata.exchange) for rdata in mx_records]
    except dns.resolver.NoAnswer:
        dns_info['MX'] = 'No MX records found'
    except Exception as e:
        dns_info['MX'] = f"Error: {str(e)}"

    # CNAME record
    try:
        cname_records = dns.resolver.resolve(domain, 'CNAME')
        dns_info['CNAME'] = [str(rdata.target) for rdata in cname_records]
    except dns.resolver.NoAnswer:
        dns_info['CNAME'] = 'No CNAME records found'
    except Exception as e:
        dns_info['CNAME'] = f"Error: {str(e)}"

    # NS record (Name Servers)
    try:
        ns_records = dns.resolver.resolve(domain, 'NS')
        dns_info['NS'] = [str(rdata) for rdata in ns_records]
    except dns.resolver.NoAnswer:
        dns_info['NS'] = 'No NS records found'
    except Exception as e:
        dns_info['NS'] = f"Error: {str(e)}"

    # TXT records
    try:
        txt_records = dns.resolver.resolve(domain, 'TXT')
        dns_info['TXT'] = [str(rdata) for rdata in txt_records]
    except dns.resolver.NoAnswer:
        dns_info['TXT'] = 'No TXT records found'
    except Exception as e:
        dns_info['TXT'] = f"Error: {str(e)}"

    return dns_info
