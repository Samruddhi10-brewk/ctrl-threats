import requests
from urllib.parse import urlparse
import logging
import ssl
import socket

MOZILLA_TLS_OBSERVATORY_API = 'https://tls-observatory.services.mozilla.com/api/v1'
REQUEST_TIMEOUT = 20  # 20 second timeout for HTTP requests

def get_basic_tls_info(domain):
    """
    Get basic TLS certificate info directly from the domain
    Returns a structure similar to Mozilla Observatory but simplified
    """
    try:
        logging.info(f"Attempting to get basic TLS info for: {domain}")
        
        # Create SSL context
        context = ssl.create_default_context()
        
        # Get certificate
        with socket.create_connection((domain, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                cipher = ssock.cipher()
                version = ssock.version()
                
                logging.info(f"Got basic TLS info for {domain}: cipher={cipher}, version={version}")
                
                # Return a minimal structure that matches Mozilla Observatory format for compatibility
                return {
                    'domain': domain,
                    'certificate': cert,
                    'cipher_name': cipher[0] if cipher else 'Unknown',
                    'tls_version': version,
                    'is_fallback': True,
                    'connection_info': {
                        'ciphersuite': cipher[0] if cipher else 'Unknown',
                        'protocol': version
                    },
                    'analysis': [{
                        'analyzer': 'basic_tls_info',
                        'result': {
                            'ciphersuite': cipher[0] if cipher else 'Unknown',
                            'protocol': version,
                            'certificate_exists': cert is not None
                        }
                    }]
                }
    except Exception as e:
        logging.error(f"Failed to get basic TLS info for {domain}: {str(e)}", exc_info=True)
        return None

def tls_handler(domain):
    """
    Fetch TLS/SSL certificate information from Mozilla's TLS Observatory
    Falls back to basic SSL info if Observatory is unavailable
    """
    logging.info(f"TLS handler received domain: {domain}")
    try:
        # Prepend 'http://' if no scheme is present
        if not domain.startswith('http://') and not domain.startswith('https://'):
            domain = 'http://' + domain

        # Parse the domain from the URL
        parsed_domain = urlparse(domain).hostname

        if not parsed_domain:
            logging.error(f"Failed to parse domain from: {domain}")
            return {
                'statusCode': 400,
                'body': {'error': 'Invalid URL or domain could not be parsed'}
            }

        logging.info(f"Initiating TLS check for: {parsed_domain}")

        try:
            # First try Mozilla's TLS Observatory
            logging.info(f"Attempting Mozilla TLS Observatory for {parsed_domain}")
            
            # Post request to scan the target domain with timeout
            scan_response = requests.post(
                f'{MOZILLA_TLS_OBSERVATORY_API}/scan?target={parsed_domain}',
                timeout=REQUEST_TIMEOUT
            )
            
            logging.info(f"Scan request status: {scan_response.status_code}")
            
            if scan_response.status_code == 200:
                scan_data = scan_response.json()
                logging.info(f"Scan data received: {scan_data}")
                scan_id = scan_data.get('scan_id')

                if isinstance(scan_id, int):
                    # Fetch the scan results using scan_id with timeout
                    logging.info(f"Fetching results for scan_id: {scan_id}")
                    result_response = requests.get(
                        f'{MOZILLA_TLS_OBSERVATORY_API}/results?id={scan_id}',
                        timeout=REQUEST_TIMEOUT
                    )
                    
                    logging.info(f"Result request status: {result_response.status_code}")
                    
                    if result_response.status_code == 200:
                        result_data = result_response.json()
                        logging.info(f"TLS scan completed successfully for {parsed_domain}")
                        
                        # Return the result
                        return {
                            'statusCode': 200,
                            'body': result_data
                        }
        
        except requests.exceptions.Timeout:
            logging.warning(f"Mozilla TLS Observatory timeout for {parsed_domain}")
        except requests.exceptions.ConnectionError:
            logging.warning(f"Cannot reach Mozilla TLS Observatory for {parsed_domain}")
        except Exception as e:
            logging.warning(f"Mozilla TLS Observatory error: {str(e)}")

        # Fallback to basic SSL info if Observatory fails
        logging.info(f"Using fallback basic TLS info for {parsed_domain}")
        basic_info = get_basic_tls_info(parsed_domain)
        
        if basic_info:
            return {
                'statusCode': 200,
                'body': basic_info
            }
        else:
            return {
                'statusCode': 503,
                'body': {'error': 'TLS information unavailable. Service temporarily unavailable.'}
            }
            
    except Exception as error:
        logging.error(f"Unexpected error in tls_handler: {str(error)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': {'error': f'TLS check error: {str(error)}'}
        }
