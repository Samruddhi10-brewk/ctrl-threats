import requests
from datetime import datetime
import asyncio

async def fetch_security_txt(domain):
    """
    Fetch the security.txt file from the /.well-known/security.txt path dynamically.
    """
    security_txt_url = f"https://{domain}/.well-known/security.txt"

    try:
        # Use run_in_executor to perform the HTTP request asynchronously
        response = await asyncio.get_event_loop().run_in_executor(None, requests.get, security_txt_url, {'timeout': 10})

        if response.status_code == 200:
            return security_txt_url, response.text
        else:
            return None, None
    except Exception as e:
        return None, f"Error fetching security.txt: {e}"

async def parse_security_txt(security_txt_content, domain):
    """
    Parse the contents of the security.txt file and extract relevant fields.
    """
    if not security_txt_content:
        return None

    # Initialize fields to capture
    security_info = {
        "PGP Signed": False,
        "Contact": [],
        "Encryption": "Unknown",
        "Acknowledgements": "Unknown",
        "Policy": "Unknown",
        "Preferred-Languages": "Unknown",
        "Canonical": "Unknown",
        "Hiring": "Unknown",
        "Expires": "Unknown"
    }

    lines = security_txt_content.splitlines()
    for line in lines:
        line = line.strip()

        if line.lower().startswith("contact:"):
            contact_info = line.split(":", 1)[1].strip()
            security_info["Contact"].append(contact_info)

        elif line.lower().startswith("preferred-languages:"):
            security_info["Preferred-Languages"] = line.split(":", 1)[1].strip()

        elif line.lower().startswith("encryption:"):
            security_info["Encryption"] = line.split(":", 1)[1].strip()

        elif line.lower().startswith("acknowledgements:"):
            security_info["Acknowledgements"] = line.split(":", 1)[1].strip()

        elif line.lower().startswith("policy:"):
            security_info["Policy"] = line.split(":", 1)[1].strip()

        elif line.lower().startswith("hiring:"):
            security_info["Hiring"] = line.split(":", 1)[1].strip()

        elif line.lower().startswith("expires:"):
            try:
                expires_date = line.split(":", 1)[1].strip()
                expires_dt = datetime.strptime(expires_date, "%Y-%m-%d")
                security_info["Expires"] = expires_dt.strftime("%d %B %Y")
            except ValueError:
                security_info["Expires"] = line.split(":", 1)[1].strip()

        elif line.startswith("-----BEGIN PGP SIGNATURE-----"):
            security_info["PGP Signed"] = True

    return security_info

async def display_security_info(domain):
    """
    Display the security.txt information for the given domain.
    """
    file_location, security_txt_content = await fetch_security_txt(domain)

    # Check if security.txt is present
    if security_txt_content is None:
        return f"Security.txt not found for {domain}"

    # Parse the security.txt content
    security_info = await parse_security_txt(security_txt_content, domain)

    # Check if the file has valid content
    has_valid_content = any(security_info[key] != "Unknown" and security_info[key] for key in security_info if key != "PGP Signed")

    # Prepare the result to display
    result = []
    result.append("Security.Txt")
    result.append(f"Present                  {'✅ Yes' if has_valid_content else '❌ No'}")
    result.append(f"File Location            {file_location}")
    result.append(f"PGP Signed               {'✅ Yes' if security_info['PGP Signed'] else '❌ No'}")

    # Display contacts (fetched from the file)
    for i, contact in enumerate(security_info['Contact'], 1):
        short_contact = contact.replace(f"https://{domain}", "")
        result.append(f"Contact{i}               {short_contact}")
        result.append(f"- Full Contact           {contact}")

    # Display other fields (if available)
    result.append(f"Encryption               {security_info['Encryption'] if security_info['Encryption'] != 'Unknown' else 'Not provided'}")
    result.append(f"- Full Encryption        {security_info['Encryption']}")
    result.append(f"Acknowledgements         {security_info['Acknowledgements'] if security_info['Acknowledgements'] != 'Unknown' else 'Not provided'}")
    result.append(f"- Full Acknowledgements  {security_info['Acknowledgements']}")
    result.append(f"Policy                   {security_info['Policy'] if security_info['Policy'] != 'Unknown' else 'Not provided'}")
    result.append(f"- Full Policy            {security_info['Policy']}")

    return "\n".join(result)
