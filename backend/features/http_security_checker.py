import aiohttp

async def check_http_security_headers(url):
    """
    Check for common HTTP security headers and their status.
    """
    # Ensure the URL has a scheme (http or https)
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url  # Default to https if no scheme is provided

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                headers = response.headers

                # Initialize the security header checks
                security_headers = {
                    "Content Security Policy": "Content-Security-Policy" in headers,
                    "Strict Transport Policy": "Strict-Transport-Security" in headers,
                    "X-Content-Type-Options": "X-Content-Type-Options" in headers,
                    "X-Frame-Options": "X-Frame-Options" in headers,
                    "X-XSS-Protection": "X-XSS-Protection" in headers
                }

                return security_headers
    except Exception as e:
        return f"Error checking headers: {e}"
