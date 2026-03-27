import ssl
import socket
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec

def get_ssl_certificate(hostname):
    context = ssl.create_default_context()
    with socket.create_connection((hostname, 443)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            cert = ssock.getpeercert(True)  # Get the certificate in DER format
            return cert

def extract_curve_info(der_cert):
    # Load the certificate from DER format
    cert = x509.load_der_x509_certificate(der_cert, default_backend())
    # Get the public key
    public_key = cert.public_key()
    # Check if the public key is an elliptic curve key
    if isinstance(public_key, ec.EllipticCurvePublicKey):
        # Define a mapping of ASN.1 curve names to NIST names
        curve_mapping = {
            "secp256r1": "P-256",
            "secp384r1": "P-384",
            "secp521r1": "P-521",
            "secp224r1": "P-224",
            "secp192r1": "P-192",
            "secp256k1": "Not NIST (used by Bitcoin)",
            "brainpoolP256r1": "BrainpoolP-256r1",
            "brainpoolP384r1": "BrainpoolP-384r1",
            "brainpoolP512r1": "BrainpoolP-512r1",
        }
        # Extract the curve name dynamically
        asn1_curve = public_key.curve.name
        # Map ASN.1 curve name to NIST curve name
        nist_curve = curve_mapping.get(asn1_curve, "Not available")
    else:
        # If it's not an EC key, set as 'Not available'
        asn1_curve = 'Not available'
        nist_curve = 'Not available'
    
    return asn1_curve, nist_curve