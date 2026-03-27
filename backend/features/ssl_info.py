import ssl
import socket
import asyncio
from datetime import datetime
from OpenSSL import crypto
import logging

async def get_ssl_info(domain):
    context = ssl.create_default_context()
    context.set_ciphers('ALL')  # Allow all ciphers (to be more permissive)

    with socket.create_connection((domain, 443)) as sock:
        try:
            with context.wrap_socket(sock, server_hostname=domain) as ssl_sock:
                cert_bin = ssl_sock.getpeercert(True)  # Get certificate in binary format
        except ssl.SSLError as e:
            print(f"Error retrieving SSL info for domain '{domain}': {e}")
            return {"error": f"Error retrieving SSL info for domain '{domain}': {e}"}

    # Parse the certificate using OpenSSL
    cert = crypto.load_certificate(crypto.FILETYPE_ASN1, cert_bin)

    # Extract issuer and subject details from the certificate
    issuer = cert.get_issuer().get_components()
    subject = cert.get_subject().get_components()

    # Convert to readable format
    issuer_dict = {x[0].decode(): x[1].decode() for x in issuer}
    subject_dict = {x[0].decode(): x[1].decode() for x in subject}

    # Extract the curve name if the public key is of type EC (Elliptic Curve)
    curve_name = None
    pub_key = cert.get_pubkey().to_cryptography_key()

    # Check if the public key is an Elliptic Curve key and extract the curve name
    if pub_key.__class__.__name__ == 'EllipticCurvePublicKey':
        curve_name = pub_key.curve.name

    # Extract expiration and renewal dates
    expires = datetime.strptime(cert.get_notAfter().decode(), "%Y%m%d%H%M%SZ").strftime("%d %B %Y")
    renewed = datetime.strptime(cert.get_notBefore().decode(), "%Y%m%d%H%M%SZ").strftime("%d %B %Y")

    # Serial number and fingerprint
    serial_num = cert.get_serial_number()
    fingerprint = cert.digest("sha1").decode().replace(':', '')

    # Format SSL info
    ssl_info = {
        "Subject": subject_dict.get('CN', 'N/A'),
        "Issuer": issuer_dict.get('O', 'N/A'),
        "Expires": expires,
        "Renewed": renewed,
        "Serial Num": format(serial_num, 'X'),
        "Fingerprint": ":".join(fingerprint[i:i+2] for i in range(0, len(fingerprint), 2))
    }

    logging.error("ssl_info",ssl_info)
    return ssl_info

