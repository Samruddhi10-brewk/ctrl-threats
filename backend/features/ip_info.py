# features/ip_info.py

import socket

def get_ip_address(domain):
    try:
        # Get the full DNS resolution including aliases and IPs
        _, _, ip_addresses = socket.gethostbyname_ex(domain)
        return ', '.join(ip_addresses)  # Return as a comma-separated string
    except socket.gaierror as e:
        # Handle DNS resolution error
        return f"Error: Unable to resolve domain '{domain}'. {e}"
