import aiodns

async def check_spf(domain):
    resolver = aiodns.DNSResolver()
    try:
        answers = await resolver.query(domain, 'TXT')
        for rdata in answers:
            if any('v=spf' in txt.decode('utf-8') for txt in rdata.strings):
                return True, rdata.to_text()
        return False, None
    except Exception as e:
        return False, str(e)

async def check_dmarc(domain):
    resolver = aiodns.DNSResolver()
    try:
        dmarc_domain = f'_dmarc.{domain}'
        answers = await resolver.query(dmarc_domain, 'TXT')
        for rdata in answers:
            if any('v=DMARC' in txt.decode('utf-8') for txt in rdata.strings):
                return True, rdata.to_text()
        return False, None
    except Exception as e:
        return False, str(e)

async def check_dkim(domain):
    return "DKIM must be checked based on the mail provider's DKIM selector."

async def check_bimi(domain):
    resolver = aiodns.DNSResolver()
    try:
        bimi_domain = f'default._bimi.{domain}'
        answers = await resolver.query(bimi_domain, 'TXT')
        for rdata in answers:
            return True, rdata.to_text()
    except Exception:
        return False, None

async def get_mx_records(domain):
    resolver = aiodns.DNSResolver()
    try:
        mx_records = await resolver.query(domain, 'MX')
        records = [(mx.exchange.to_text(), mx.preference) for mx in mx_records]
        return records
    except Exception as e:
        return str(e)
