import aiohttp
import asyncio
import json

async def check_google_safe_browsing(api_key, url):
    """
    Check if the website is flagged by Google Safe Browsing.
    """
    api_url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"

    payload = {
        "client": {
            "clientId": "yourcompanyname",
            "clientVersion": "1.5.2"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": url}
            ]
        }
    }

    headers = {'Content-Type': 'application/json'}

    async with aiohttp.ClientSession() as session:
        async with session.post(api_url, headers=headers, json=payload) as response:
            if response.status == 200:
                result = await response.json()
                if 'matches' in result:
                    return False, "Malware Identified"
                else:
                    return True, "Safe"
            else:
                return None, f"Error: {response.status}"

async def check_virustotal(api_key, url):
    """
    Check if the website is flagged by VirusTotal.
    """
    vt_url = "https://www.virustotal.com/vtapi/v2/url/report"
    params = {
        'apikey': api_key,
        'resource': url,
    }

    async with aiohttp.ClientSession() as session:
        async with session.get(vt_url, params=params) as response:
            if response.status == 200:
                result = await response.json()
                if result.get('positives', 0) > 0:
                    threat_types = set()  # Use a set to ensure unique threat types
                    for vendor, scan_data in result['scans'].items():
                        if scan_data['detected']:
                            threat_types.add(scan_data['result'])
                    return False, "Threat Detected", list(threat_types)
                else:
                    return True, "Safe", None
            else:
                return None, f"Error: {response.status}", None

async def display_threat_status(google_api_key, virustotal_api_key, url):
    """
    Display the overall threat status of a website, including the types of threats detected.
    """
    google_safe, google_status = await check_google_safe_browsing(google_api_key, url)
    virustotal_safe, virustotal_status, virustotal_threats = await check_virustotal(virustotal_api_key, url)

    result = {
        "Google Safe Browsing": google_status,
        "VirusTotal": virustotal_status,
        "Threats": virustotal_threats if virustotal_threats else "None"
    }

    overall_safe = google_safe and virustotal_safe
    overall_verdict = "Safe" if overall_safe else "Threat Detected"

    return {
        "details": result,
        "overall_verdict": overall_verdict
    }
