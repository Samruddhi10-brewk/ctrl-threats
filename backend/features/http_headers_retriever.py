import requests

def get_http_headers(domain):
    try:
        # Send a GET request to the website
        response = requests.get(f"https://{domain}", timeout=10)  # Adding a timeout

        # Extract headers from the response
        headers = response.headers

        # Format the headers into a dictionary
        headers_info = {key: value for key, value in headers.items()}

        return headers_info
    except requests.exceptions.Timeout:
        return f"Error: Timeout while trying to retrieve HTTP headers for {domain}."
    except requests.exceptions.RequestException as e:
        return f"Error: Unable to retrieve HTTP headers for {domain}. {e}"
