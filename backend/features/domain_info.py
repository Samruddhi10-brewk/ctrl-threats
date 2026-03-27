import whois
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Function to handle both list and single datetime objects
def parse_date(date_field):
    if isinstance(date_field, list):
        return date_field[0].strftime('%Y-%m-%d') if isinstance(date_field[0], datetime) else "N/A"
    elif isinstance(date_field, datetime):
        return date_field.strftime('%Y-%m-%d')
    return "N/A"

async def get_whois_data(domain_name):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        # Run the blocking whois lookup in a separate thread
        domain_info = await loop.run_in_executor(executor, whois.whois, domain_name)
        
        # Organize the data
        domain_data = {
            "Domain": domain_info.get("domain_name", domain_name),
            "Registrar": domain_info.get("registrar", "N/A"),
            "Registered On": parse_date(domain_info.get("creation_date", "N/A")),
            "Expires On": parse_date(domain_info.get("expiration_date", "N/A")),
            "Updated On": parse_date(domain_info.get("updated_date", "N/A")),
            "Status": domain_info.get("status", []),
            "Name Servers": domain_info.get("name_servers", [])
        }
        registrant_contact = {
            "Name": domain_info.get("name", "N/A"),
            "Organization": domain_info.get("org", "N/A"),
            "Street": domain_info.get("address", "N/A"),
            "City": domain_info.get("city", "N/A"),
            "State": domain_info.get("state", "N/A"),
            "Postal Code": domain_info.get("postalcode", "N/A"),
            "Country": domain_info.get("country", "N/A"),
            "Phone": domain_info.get("phone", "N/A"),
            "Email": domain_info.get("email", "N/A")
        }
        admin_contact = registrant_contact  # Assuming it's the same; modify if needed.
        tech_contact = registrant_contact   # Assuming it's the same; modify if needed.
        # Raw WHOIS Data
        raw_whois_data = domain_info.text if hasattr(domain_info, 'text') else "Raw WHOIS data not available"
        # Combine all the data
        whois_data = {
            "Domain Information": domain_data,
            "Registrant Contact": registrant_contact,
            "Administrative Contact": admin_contact,
            "Technical Contact": tech_contact,
            "Raw Whois Data": raw_whois_data.strip()
        }
        return whois_data
