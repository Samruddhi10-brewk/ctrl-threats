import requests

def get_cookies(domain):
    try:
        # Make a request to the website
        response = requests.get(f"https://{domain}", timeout=10)

        # Extract cookies from the response
        cookies = response.cookies

        # Format the cookies into a dictionary
        cookie_info = {}
        for cookie in cookies:
            cookie_info[cookie.name] = {
                'Value': cookie.value,
                'Domain': cookie.domain or domain,  # Use provided domain if none
                'Path': cookie.path,
                'Secure': cookie.secure,
                'HttpOnly': cookie.has_nonstandard_attr('HttpOnly')
            }

        return cookie_info
    except requests.exceptions.Timeout:
        return f"Error: Timeout while trying to retrieve cookies for {domain}."
    except requests.exceptions.RequestException as e:
        return f"Error: Unable to retrieve cookies for {domain}. {e}"
