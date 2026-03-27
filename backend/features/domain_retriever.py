import requests
import re

def get_associated_domains(domain):
    try:
        # Fetch certificate transparency data from crt.sh for the given domain
        url = f"https://crt.sh/?q=%25.{domain}&output=json"
        response = requests.get(url, timeout=10)  # Adding timeout to avoid long blocking
       
        # Check if the request was successful
        if response.status_code != 200:
            return f"Error: Unable to retrieve data from crt.sh for {domain} (Status code: {response.status_code})"

        # Parse the response JSON data
        certs = response.json()
        associated_domains = set()

        # Extract subdomains from the certificate data
        for cert in certs:
            name_value = cert.get('name_value', '')
            # Split names by newlines (some have multiple entries)
            for subdomain in name_value.split("\n"):
                if domain in subdomain:
                    associated_domains.add(subdomain)

        # Return the list of associated domains
        return list(associated_domains)

    except requests.exceptions.Timeout:
        return f"Error: Timeout while trying to retrieve associated domains for {domain}."
    except Exception as e:
        return f"Error: Unable to retrieve associated domains for {domain}. {e}"
