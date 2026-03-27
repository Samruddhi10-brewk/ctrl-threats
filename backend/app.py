import base64
from flask import Flask
import asyncio
import logging
from quart import Quart, request, jsonify
import requests,sys,io
from features.favicon import download_favicon
from features.ip_info import get_ip_address
from features.ssl_info import get_ssl_info
from features.ssl_curve_info import get_ssl_certificate, extract_curve_info
from features.dns_records import get_dns_records
from features.cookie_retriever import get_cookies
from features.robots_retriever import get_robots_txt
from features.http_headers_retriever import get_http_headers
from features.ip_location_retriever import get_server_location, get_ip_address
from features.domain_retriever import get_associated_domains
from features.redirect_chain_retriever import get_redirect_chain
from features.scan_ports import scan_common_ports 
from features.traceroute import perform_traceroute  
from features.carbon_footprint import get_carbon_data
from features.server_info_utils import get_server_info
from features.dnssec_checker import format_dnssec_report
from features.domain_info import get_whois_data
from features.hsts_checker import format_hsts_report
from features.dns_checker import display_dns_server_info
from features.security_checker import display_security_info
from features.linked_pages import linked_pages_handler
from features.social_tags import social_tags_handler
from features.waf_checker import display_firewall_info
from features.http_security_checker import check_http_security_headers
from features.rank_checker import rank_handler
from features.block_detection import check_blocklists
from features.threat_checker import display_threat_status
from features.tls_checker import tls_handler
from features.dns_check import check_spf, check_dmarc, check_dkim, check_bimi, get_mx_records
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi import Request

app = FastAPI()

# Configure the logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Replace "*" with specific domains if needed.
    allow_credentials=True,  # Allows cookies and credentials.
    allow_methods=["*"],  # Allows all HTTP methods.
    allow_headers=["*"],  # Allows all headers.
)


# Route for IP address resolution
# @app.route('/get-ip', methods=['GET'])
async def get_ip(domain):
    logging.info(f"Received request to resolve IP for domain: {domain}")
    if domain:
        try:
            ip_list = get_ip_address(domain)
            logging.info(f"IP addresses for {domain}: {ip_list}")
            # Check if the response is an error or a list of IPs
            if "Error:" in ip_list:  # If it's an error message
                logging.error(f"Error retrieving IP for {domain}: {ip_list}")
                return {'error': ip_list}
            return {'domain': domain, 'ip_addresses': ip_list}
        except Exception as e:
            logging.error(f"Exception occurred while resolving IP for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for SSL Chain
# @app.route('/get-ssl', methods=['GET'])
async def get_ssl(domain):
    logging.info(f"Received request for SSL info for domain: {domain}")
    if domain:
        try:
            ssl_info = await get_ssl_info(domain)  # Ensure SSL info retrieval is async
            logging.info(f"SSL info for {domain}: {ssl_info}")
            if isinstance(ssl_info, dict):
                return {'domain': domain, 'ssl_info': ssl_info}
            logging.error(f"Error retrieving SSL info for {domain}: {ssl_info}")
            return {'error': ssl_info}
        except Exception as e:
            logging.error(f"Exception occurred while getting SSL info for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for SSL curve information retrieval
# @app.route('/get-ssl-curve', methods=['GET'])
async def get_ssl_curve(domain):
    logging.info(f"Received request for SSL curve info for domain: {domain}")
    if domain:
        try:
            der_cert = get_ssl_certificate(domain)
            # Extract curve information
            asn1_curve, nist_curve = extract_curve_info(der_cert)
            logging.info(f"Curve info for {domain}: ASN1={asn1_curve}, NIST={nist_curve}")
            # Prepare response
            return {
                'domain': domain,
                'ASN1_Curve': asn1_curve,
                'NIST_Curve': nist_curve
            }
        except Exception as e:
            logging.error(f"Exception occurred while getting SSL curve info for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Hostname not provided'}

# Route for DNS record retrieval
# @app.route('/get-dns-records', methods=['GET'])
async def fetch_dns_records(domain):
    logging.info(f"Received request for DNS records of domain: {domain}")
    if domain:
        try:
            dns_info = get_dns_records(domain)
            logging.info(f"DNS records for {domain}: {dns_info}")
            return {
                'domain': domain,
                'dns_records': dns_info
            }
        except Exception as e:
            logging.error(f"Error retrieving DNS info for {domain}: {e}")
            return {'error': f"Error retrieving DNS info: {str(e)}"}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for cookie retrieval
# @app.route('/get-cookies', methods=['GET'])
async def fetch_cookies(domain):
    logging.info(f"Received request for cookies of domain: {domain}")
    if domain:
        try:
            cookie_info = await asyncio.get_event_loop().run_in_executor(None, get_cookies, domain)
            logging.info(f"Cookies for {domain}: {cookie_info}")
            return {'domain': domain, 'cookies': cookie_info}
        except Exception as e:
            logging.error(f"Error retrieving cookies for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for robots.txt retrieval
# @app.route('/get-robots-txt', methods=['GET'])
async def fetch_robots_txt(domain):
    logging.info(f"Received request for robots.txt of domain: {domain}")
    if domain:
        try:
            # Run the blocking function asynchronously
            content = await asyncio.get_event_loop().run_in_executor(None, get_robots_txt, domain)
            logging.info(f"robots.txt content for {domain}: {content}")
            return {'domain': domain, 'robots_txt': content}
        except Exception as e:
            logging.error(f"Error retrieving robots.txt for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for HTTP headers retrieval
# @app.route('/get-http-headers', methods=['GET'])
async def http_headers(domain):
    logging.info(f"Received request for HTTP headers of domain: {domain}")
    if domain:
        try:
            # Run the blocking function asynchronously
            headers_info = await asyncio.get_event_loop().run_in_executor(None, get_http_headers, domain)
            logging.info(f"HTTP headers for {domain}: {headers_info}")
            return {'domain': domain, 'headers': headers_info}
        except Exception as e:
            logging.error(f"Error retrieving HTTP headers for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for IP address and server location retrieval
# @app.route('/get-server-location', methods=['GET'])
async def server_location(domain):
    logging.info(f"Received request for server_location of domain: {domain}")
    if domain:
        try:
            ip_address = get_ip_address(domain)
            logging.info(f"server_location for {domain}: {ip_address}")
            if ip_address:
                location_info = get_server_location(ip_address)
                logging.info(f"server_location for {domain}: {location_info}")
                return {'domain': domain, 'ip_address': ip_address, 'location_info': location_info}
            logging.error(f"Error retrieving server_location for {domain}: {e}")
            return {'error': f"Could not resolve IP for {domain}."}
        except Exception as e:
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for associated domain retrieval
# @app.route('/get-associated-domains', methods=['GET'])
async def associated_domains(domain):
    logging.info(f"Received request for associated domains of domain: {domain}")
    if domain:
        try:
            # Run the blocking get_associated_domains function asynchronously
            associated_domains_list = await asyncio.get_event_loop().run_in_executor(None, get_associated_domains, domain)
            logging.info(f"Associated domains for {domain}: {associated_domains_list}")
            
            if isinstance(associated_domains_list, list):
                return {'domain': domain, 'associated_domains': associated_domains_list}
            logging.error(f"Error retrieving associated domains for {domain}: {associated_domains_list}")
            return {'error': associated_domains_list}
        except Exception as e:
            logging.error(f"Error in associated_domains for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}

# Route for redirect chain retrieval
# @app.route('/get-redirect-chain', methods=['GET'])
async def redirect_chain(domain):
    logging.info(f"Received request for redirect chain of domain: {domain}")
    if domain:
        try:
            # Run the blocking get_redirect_chain function asynchronously
            chain = await asyncio.get_event_loop().run_in_executor(None, get_redirect_chain, domain)
            logging.info(f"Redirect chain for {domain}: {chain}")
            
            if isinstance(chain, list):
                return {'domain': domain, 'redirect_chain': chain}
            logging.error(f"Error retrieving redirect chain for {domain}: {chain}")
            return {'error': chain}
        except Exception as e:
            logging.error(f"Error in redirect_chain for {domain}: {e}")
            return {'error': str(e)}
    logging.error("Domain not provided")
    return {'error': 'Domain not provided'}


# Route for check_server_status
# @app.route('/check-server-status', methods=['GET'])
async def check_server_status(domain):
    logging.info(f"Received request for check_server_status of domain: {domain}")
    if not domain:
        logging.error("Domain not provided for server status check")
        return "Error: No domain provided.", 400
    
    # Add scheme if not provided
    if not domain.startswith('http://') and not domain.startswith('https://'):
        domain = 'https://' + domain
    
    try:
        # Send a GET request to the server
        response = requests.get(domain, timeout=10)

        # Check if the status code indicates success (200 OK)
        if response.status_code == 200:
            logging.info(f"Server is online for {domain}, Status Code: {response.status_code}")
            return {"message": f"Server is online. Status Code: {response.status_code}"}
        else:
            logging.warning(f"Server response for {domain}: Status Code {response.status_code}")
            return {"message": f"Server responded with status code: {response.status_code}"}

    except requests.ConnectionError:
        logging.error(f"ConnectionError: Server is offline or unreachable for {domain}")
        return {"error": "Server is offline or unreachable."}
    except requests.Timeout:
        logging.error(f"TimeoutError: Request to {domain} timed out.")
        return {"error": "The request timed out."}
    except Exception as e:
        logging.error(f"Unexpected error occurred while checking server status for {domain}: {e}")
        return {"error": f"An unexpected error occurred. {e}"}
    
# API route to scan ports on a given host
# @app.route('/scan-ports', methods=['GET'])
async def scan_ports_api(domain):
    logging.info(f"Received request to scan ports for domain: {domain}")
    
    if not domain:
        logging.error("No host provided for port scanning.")
        return {"error": "No host provided."}

    try:
        # Run the blocking scan_common_ports function asynchronously
        open_ports = await asyncio.get_event_loop().run_in_executor(None, scan_common_ports, domain)
        
        if open_ports:
            logging.info(f"Open ports for {domain}: {open_ports}")
            return {"domain": domain, "open_ports": open_ports}
        else:
            logging.info(f"No open ports found for {domain}.")
            return {"domain": domain, "open_ports": [], "message": "No open ports found."}
    except Exception as e:
        logging.error(f"An unexpected error occurred while scanning ports for {domain}: {e}")
        return {"error": f"An unexpected error occurred: {e}"}

# API route for traceroute
@app.get("/traceroute")
async def traceroute(request: Request):
    domain = request.query_params.get('domain')
    
    logging.info(f"Received traceroute request for domain: {domain}")
    
    if not domain:
        return JSONResponse(content={"error": "Domain not provided"}, status_code=400)

    try:
        # Clean domain
        domain = domain.strip()
        if domain.startswith('http://'):
            domain = domain[7:]
        elif domain.startswith('https://'):
            domain = domain[8:]
        domain = domain.split('/')[0]
        
        logging.info(f"Executing traceroute for cleaned domain: {domain}")
        traceroute_result = await asyncio.get_event_loop().run_in_executor(None, perform_traceroute, domain)
        logging.info(f"Traceroute completed for {domain}")
        return JSONResponse(content={"domain": domain, "traceroute": traceroute_result}, status_code=200)
    except ValueError as e:
        logging.warning(f"Traceroute ValueError for {domain}: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=400)
    except Exception as e:
        logging.error(f"Traceroute failed for {domain}: {type(e).__name__}: {str(e)}", exc_info=True)
        return JSONResponse(content={"error": f"Traceroute failed: {str(e)}"}, status_code=500)



@app.get("/favicon")
async def get_favicon(request: Request):
    # Retrieve the domain from the query parameters
    domain = request.query_params.get('domain')
    
    logging.info(f"Received request to fetch favicon for domain: {domain}")
    
    if not domain:
        logging.error("No domain name provided for favicon fetch.")
        return JSONResponse(content={"error": "No domain name provided."}, status_code=400)  # HTTP 400 if domain is missing

    try:
        # Run the download_favicon function asynchronously
        favicon_data = await download_favicon(domain)

        # Encode the favicon data to Base64
        favicon_base64 = base64.b64encode(favicon_data).decode('utf-8')  # Correct encoding

        # Return the favicon as a response
        return JSONResponse(
            content={"domain": domain, "favicon": "data:image/x-icon;base64," + favicon_base64},
            media_type="application/json"
        )

    except Exception as e:
        logging.error(f"An unexpected error occurred while fetching favicon for {domain}: {e}")
        return JSONResponse(content={"error": f"An unexpected error occurred: {e}"}, status_code=500) 


# API route for carbon data
# @app.route('/carbon', methods=['GET'])
async def carbon(domain):
    logging.info(f"Received request to get carbon data for domain: {domain}")
    
    if not domain:
        logging.error("No URL provided for carbon data.")
        return {"error": "No URL provided."}

    try:
        # Fetch the carbon data for the URL asynchronously
        carbon_data = await get_carbon_data(domain)
        logging.info(f"Carbon data for {domain}: {carbon_data}")
        return carbon_data

    except Exception as e:
        logging.error(f"Error retrieving carbon data for {domain}: {e}")
        return {"error": str(e)}

# API route for server information
# @app.route('/server-info', methods=['GET'])
async def server_info(domain):
    logging.info(f"Received request to get server info for domain: {domain}")
    
    if not domain:
        logging.error("No URL provided for server info.")
        return {"error": "No URL provided."}

    try:
        # Fetch the server information for the URL asynchronously
        info = await get_server_info(domain)
        logging.info(f"Server info for {domain}: {info}")
        return info

    except Exception as e:
        logging.error(f"Error retrieving server info for {domain}: {e}")
        return {"error": str(e)}

# @app.route('/domain-info', methods=['GET'])
async def domain_info(domain):
    logging.info(f"Received request to get domain info for domain: {domain}")

    if not domain:
        logging.error("No domain provided for domain info.")
        return {"error": "No domain provided."}

    try:
        # Extract domain information asynchronously
        domain_data = await get_whois_data(domain)
        logging.info(f"Domain info for {domain}: {domain_data}")
        return domain_data

    except Exception as e:
        logging.error(f"Error retrieving domain info for {domain}: {e}")
        return {"error": str(e)}

# @app.route('/check_dnssec', methods=['GET'])
async def check_dnssec(domain):
    logging.info(f"Received request to check DNSSEC for domain: {domain}")
    if not domain:
        logging.error("Domain parameter is required for DNSSEC check.")
        return {'error': 'Domain parameter is required.'}
    
    try:
        report = await format_dnssec_report(domain)
        logging.info(f"DNSSEC report for {domain}: {report}")
        return report
    except Exception as e:
        logging.error(f"Error checking DNSSEC for {domain}: {e}")
        return {'error': str(e)}

# @app.route('/check_hsts', methods=['GET'])
async def check_hsts(domain):
    logging.info(f"Received request to check HSTS for domain: {domain}")
    if not domain:
        logging.error("URL parameter is required for HSTS check.")
        return {'error': 'URL parameter is required.'}
    
    try:
        report = await format_hsts_report(domain)
        logging.info(f"HSTS report for {domain}: {report}")
        return report
    except Exception as e:
        logging.error(f"Error checking HSTS for {domain}: {e}")    
        return {'error': str(e)}

@app.get("/check_dns")
async def check_dns(request: Request):  # Correct route definition
    # Get the domain from the query string
    domain = request.query_params.get('domain')

    logging.info(f"Received request to check DNS for domain: {domain}")
    
    # Check if the domain is provided in the query string
    if not domain:
        logging.error("Please provide a domain name for DNS check.")
        return JSONResponse(content={"error": "Please provide a domain name."}, status_code=400)
    
    try:
        # Get the DNS server info directly by awaiting the async function
        result = await display_dns_server_info(domain)
        
        logging.info(f"DNS check result for {domain}: {result}")
        return JSONResponse(content={"result": result})
    except Exception as e:
        logging.error(f"Error during DNS check for {domain}: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


# @app.route('/check_security', methods=['GET'])
async def check_security(domain):
    logging.info(f"Received request to check security for domain: {domain}")
    
    if not domain:
        logging.error("Please provide a domain name for security check.")
        return {"error": "Please provide a domain name."}
    
    try:
        # Directly await display_security_info if it's async
        result = await display_security_info(domain)
        logging.info(f"Security check result for {domain}: {result}")
        return {"result": result}
    except Exception as e:
        logging.error(f"Error during security check for {domain}: {e}")
        return {"error": str(e)}


# @app.route('/social-tags', methods=['GET'])
async def get_social_tags(domain):
    logging.info(f"Received request to get social tags for domain: {domain}")
    if not domain:
        logging.error("URL parameter is required for social tags.")
        return {'error': 'URL parameter is required'}
    
    try:
        result = await social_tags_handler(domain)  # Await the async handler
        logging.info(f"Social tags for {domain}: {result}")
        return result
    except Exception as e:
        logging.error(f"Error retrieving social tags for {domain}: {e}")
        return {'error': str(e)} 

# @app.route('/check-firewall', methods=['GET'])
async def check_firewall_endpoint(domain):
    logging.info(f"Received request to check firewall for domain: {domain}")
    if domain:
        try:
            firewall_info = await display_firewall_info(domain)  # Await the async handler
            logging.info(f"Firewall info for {domain}: {firewall_info}")
            return {'domain': domain, 'firewall_info': firewall_info}
        except Exception as e:
            logging.error(f"Error checking firewall for {domain}: {e}")
            return {'error': str(e)}
    
    logging.error("URL not provided for firewall check.")
    return {'error': 'URL not provided'}

# @app.route('/check-http-security', methods=['GET'])
async def check_http_security(domain):
    logging.info(f"Received request to check HTTP security headers for domain: {domain}")
    if domain:
        try:
            security_headers = await check_http_security_headers(domain)  # Await the async handler
            logging.info(f"HTTP security headers for {domain}: {security_headers}")
            if isinstance(security_headers, dict):
                return {'url': domain, 'security_headers': security_headers}
            return {'error': security_headers}
        except Exception as e:
            logging.error(f"Error checking HTTP security headers for {domain}: {e}")
            return {'error': str(e)}
    
    logging.error("URL not provided for HTTP security check.")
    return {'error': 'URL not provided'}

# API endpoint for checking email configuration
# @app.route('/check-email-config', methods=['GET'])
async def check_email_configuration(domain):
    logging.info(f"Received request to check email configuration for domain: {domain}")
    if not domain:
        logging.error("Domain is required for email configuration check.")
        return {"error": "Domain is required"}
    
    try:
        # SPF Check
        spf_exists, _ = await check_spf(domain)
        logging.info(f"SPF exists for {domain}: {spf_exists}")
        
        # DKIM Check
        dkim_status = await check_dkim(domain)
        logging.info(f"DKIM status for {domain}: {dkim_status}")
        
        # DMARC Check
        dmarc_exists, _ = await check_dmarc(domain)
        logging.info(f"DMARC exists for {domain}: {dmarc_exists}")

        # BIMI Check
        bimi_exists, _ = await check_bimi(domain)
        logging.info(f"BIMI exists for {domain}: {bimi_exists}")
        
        # MX Records
        mx_records = await get_mx_records(domain)
        logging.info(f"MX records for {domain}: {mx_records}")
        
        # Format the result string
        result = f"Email Configuration\n"
        result += f"SPF                      {'✅ Yes' if spf_exists else '❌ No'}\n"
        result += f"DKIM                     {'✅ Yes (Based on provider DKIM selector)'}\n"
        result += f"DMARC                    {'✅ Yes' if dmarc_exists else '❌ No'}\n"
        result += f"BIMI                     {'✅ Yes' if bimi_exists else '❌ No'}\n\n"
        result += "MX Records\n"
        if isinstance(mx_records, list):
            for record, priority in mx_records:
                result += f"{record}   Priority: {priority}\n"
        else:
            result += mx_records  # Handle error or empty result
        return {"result": result}
    except Exception as e:
        logging.error(f"Error checking email configuration for {domain}: {e}")
        return {"error": str(e)}

# @app.route('/get-rank', methods=['GET'])
async def get_rank(domain):
    logging.info(f"Received request to get rank for domain: {domain}")
    if not domain:
        logging.error("URL parameter is required for rank check.")
        return {'error': 'URL parameter is required'}
    try:
        result = await rank_handler(domain)  # Await the async handler
        logging.info(f"Rank info for {domain}: {result}")
        return result
    except Exception as e:
        logging.error(f"Error retrieving rank for {domain}: {e}")
        return {'error': str(e)}

# @app.route('/check-url', methods=['GET'])
async def check_url(domain):
    logging.info(f"Received request to check blocklists for domain: {domain}")
    if not domain:
        logging.error("URL parameter is required for blocklist check.")
        return {'error': 'URL parameter is required'}
    try:
        results = await check_blocklists(domain)  # Await the async check
        logging.info(f"Blocklist results for {domain}: {results}")
        return results
    except Exception as e:
        logging.error(f"Error checking blocklists for {domain}: {e}")
        return {'error': str(e)}
    

async def get_links(domain):
    logging.info(f"Received request to get linked pages for domain: {domain}")
    
    if not domain:
        logging.error("URL parameter is required for linked pages.")
        return {'error': 'URL parameter is required'}

    try:
        # Check if the URL starts with a scheme (http or https)
        if not domain.startswith(('http://', 'https://')):
            domain = f'https://{domain}'  # Prepend https:// if no scheme is provided

        # Await the result from the async linked_pages_handler function
        result = await linked_pages_handler(domain)
        logging.info(f"Linked pages for {domain}: {result}")
        return result  # Ensure this is fully resolved before returning
    except Exception as e:
        logging.error(f"Error retrieving linked pages for {domain}: {e}")
        return {'error': str(e)}

# @app.route('/check-threat', methods=['GET'])
async def check_threat(domain):
    logging.info(f"Received request to check threat status for domain: {domain}")
    google_api_key = "AIzaSyB3WOIRJwZ5po7wPq5oNYuTw3JbqqgQsUo"  # Replace with your Google Safe Browsing API key
    virustotal_api_key = "baa316b3740ea5b86005505ce8d35d52e6ccd321c26df74dd1a7fa2fd2824c9d"  # Replace with your VirusTotal API key

    if not domain:
        logging.error("URL parameter is required for threat check.")
        return {'error': 'URL parameter is required'}
    try:
        result = await display_threat_status(google_api_key, virustotal_api_key, domain)
        logging.info(f"Threat status for {domain}: {result}")
        return result
    except Exception as e:
        logging.error(f"Error checking threat status for {domain}: {e}")
        return {'error': str(e)}

@app.get("/check-tls")
@app.get("/check-tls")
async def check_tls(request: Request):
    domain = request.query_params.get('domain')
    logging.info(f"TLS check request for domain: {domain}")

    if not domain:
        logging.error("No domain provided for TLS check")
        return JSONResponse(content={"error": "Domain not provided"}, status_code=400)

    try:
        # Run tls_handler in executor to avoid blocking event loop
        tls_result = await asyncio.get_event_loop().run_in_executor(None, tls_handler, domain)
        
        logging.info(f"TLS result status: {tls_result.get('statusCode')}")
        
        # Check for errors in result
        if 'error' in tls_result.get('body', {}):
            error_msg = tls_result['body'].get('error', 'Unknown error')
            logging.error(f"TLS check error for {domain}: {error_msg}")
            status_code = tls_result.get('statusCode', 500)
            return JSONResponse(content={"error": error_msg}, status_code=status_code)

        # Return successful result
        return JSONResponse(
            content={"domain": domain, "TLS": tls_result['body']},
            status_code=200
        )

    except Exception as e:
        logging.error(f"TLS check failed for {domain}: {type(e).__name__}: {str(e)}", exc_info=True)
        return JSONResponse(
            content={"error": f"TLS check failed: {str(e)}"},
            status_code=500
        )



async def run_checks(domain):
    tasks = [
        get_ip(domain),
        get_ssl(domain),
        get_ssl_curve(domain),
        fetch_dns_records(domain),
        fetch_cookies(domain),
        fetch_robots_txt(domain),
        http_headers(domain),
        server_location(domain),
        associated_domains(domain),
        redirect_chain(domain),
        check_server_status(domain),
        scan_ports_api(domain),
        carbon(domain),
        # server_info(domain),
        domain_info(domain),
        check_dnssec(domain),
        check_hsts(domain),
        check_security(domain),
        get_links(domain),
        get_social_tags(domain),
        check_firewall_endpoint(domain),
        check_http_security(domain),
        check_email_configuration(domain),
        get_rank(domain),
        check_url(domain),
        check_threat(domain),
    ]
    return await asyncio.gather(*tasks)  

@app.get('/webscan')
async def webscan(domain: str = None):
    logging.info(f"Received webscan request for domain: {domain}")
    
    if not domain:
        logging.error("Domain not provided in webscan request.")
        return JSONResponse(content={'error': 'Domain not provided'}, status_code=400)

    try:
        # Assuming run_checks is async and returns the result as a list
        results = await run_checks(domain)  

        # Structure the results in a dictionary
        response = {
            "domain": domain,
            "ip": results[0],
            "ssl": results[1],
            "ssl_curve": results[2],
            "dns_record": results[3],
            "cookies": results[4],
            "robots_txt": results[5],
            "http_headers": results[6],
            "server_location": results[7],
            "associated_domains": results[8],
            "redirect_chain": results[9],
            "check_server_status": results[10],
            "scan_ports_api": results[11],
            "carbon": results[12],
            "domain_info": results[13],
            "check_dnssec": results[14],
            "check_hsts": results[15],
            "check_security": results[16],
            "get_links": results[17],
            "get_social_tags": results[18],
            "check_firewall_endpoint": results[19],
            "check_http_security": results[20],
            "check_email_configuration": results[21],
            "get_rank": results[22],
            "check_url": results[23],
            "check_threat": results[24],
        }

        logging.info(f"Webscan results for {domain}: {response}")
        return JSONResponse(content=response, status_code=200)

    except Exception as e:
        logging.error(f"Error processing webscan for domain {domain}: {e}")
        return JSONResponse(content={'error': str(e)}, status_code=500)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001)

# test
