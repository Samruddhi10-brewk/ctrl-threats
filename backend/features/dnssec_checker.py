import dns.resolver
import dns.message
import dns.query
import dns.rdatatype
import dns.flags
import asyncio

# Main async function to check DNSSEC for a given domain
async def check_dnssec(domain):
    results = {}

    # Async function to perform DNS queries and check if DNSSEC records are present
    async def query_record(domain, record_type):
        try:
            # Run DNS query in a separate thread to avoid blocking the event loop
            answers = await asyncio.to_thread(dns.resolver.resolve, domain, record_type)
            return answers
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
            return None

    # Recursion Desired (RD) and Available (RA) are part of DNS flags, not DNS records
    async def check_recursion(domain):
        query = dns.message.make_query(domain, dns.rdatatype.ANY)
        # Use Google's public DNS for recursion check
        response = await asyncio.to_thread(dns.query.udp, query, '8.8.8.8')
        flags = response.flags
        return {
            'Recursion Desired (RD)': bool(flags & dns.flags.RD),
            'Recursion Available (RA)': bool(flags & dns.flags.RA)
        }

    # DNSSEC-specific flags check (TrunCation, Authentic Data, Checking Disabled)
    async def check_dnssec_flags(domain):
        query = dns.message.make_query(domain, dns.rdatatype.ANY, want_dnssec=True)
        response = await asyncio.to_thread(dns.query.udp, query, '8.8.8.8')
        flags = response.flags
        return {
            'TrunCation (TC)': bool(flags & dns.flags.TC),
            'Authentic Data (AD)': bool(flags & dns.flags.AD),
            'Checking Disabled (CD)': bool(flags & dns.flags.CD),
        }

    # Function to check DNSSEC records and flags for each feature (DNSKEY, DS, RRSIG)
    async def check_feature(feature):
        record_present = await query_record(domain, feature)
        recursion_flags = await check_recursion(domain)
        dnssec_flags = await check_dnssec_flags(domain)

        return {
            'Present': 'Present' if record_present else 'Not Present',
            **recursion_flags,
            **dnssec_flags
        }

    # Checking DNSKEY, DS, and RRSIG records
    results['DNSKEY'] = await check_feature('DNSKEY')
    results['DS'] = await check_feature('DS')
    results['RRSIG'] = await check_feature('RRSIG')

    return results

# Async function to format DNSSEC report
async def format_dnssec_report(domain):
    report = await check_dnssec(domain)
    formatted_report = {}

    # Format each record (DNSKEY, DS, RRSIG) for display
    for record in ['DNSKEY', 'DS', 'RRSIG']:
        formatted_report[record] = {
            'Present': report[record].get('Present', 'Unknown'),
            'Recursion Desired (RD)': report[record].get('Recursion Desired (RD)', False),
            'Recursion Available (RA)': report[record].get('Recursion Available (RA)', False),
            'TrunCation (TC)': report[record].get('TrunCation (TC)', False),
            'Authentic Data (AD)': report[record].get('Authentic Data (AD)', False),
            'Checking Disabled (CD)': report[record].get('Checking Disabled (CD)', False),
        }

    return formatted_report

# Async function to print DNSSEC report
async def print_dnssec_report(domain):
    formatted_report = await format_dnssec_report(domain)

    # DNSSEC Report Output
    print(f"\nDNSSEC Report for {domain}:\n")

    for record in ['DNSKEY', 'DS', 'RRSIG']:
        print(f"\n{record} - Present? ", formatted_report[record].get('Present', 'Unknown'))
        print("Recursion Desired (RD) ", "✔️" if formatted_report[record].get('Recursion Desired (RD)') else "❌")
        print("Recursion Available (RA) ", "✔️" if formatted_report[record].get('Recursion Available (RA)') else "❌")
        print("TrunCation (TC) ", "✔️" if formatted_report[record].get('TrunCation (TC)') else "❌")
        print("Authentic Data (AD) ", "✔️" if formatted_report[record].get('Authentic Data (AD)') else "❌")
        print("Checking Disabled (CD) ", "✔️" if formatted_report[record].get('Checking Disabled (CD)') else "❌")


