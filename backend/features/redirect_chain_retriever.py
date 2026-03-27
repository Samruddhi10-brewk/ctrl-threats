import requests

def get_redirect_chain(url):
    # Ensure the URL has a scheme (http or https)
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url  # Default to http if no scheme is provided

    try:
        # Send a GET request to the URL and follow redirects
        response = requests.get(url, allow_redirects=True, timeout=10)  # Adding timeout

        # Extract the redirect chain from the response history
        redirect_chain = []
        for resp in response.history:
            redirect_chain.append({
                'Status Code': resp.status_code,
                'Redirected URL': resp.url
            })

        # Append the final URL and status code
        redirect_chain.append({
            'Status Code': response.status_code,
            'Final URL': response.url
        })

        return redirect_chain

    except requests.exceptions.Timeout:
        return f"Error: Timeout while trying to retrieve redirect chain for {url}."
    except Exception as e:
        return f"Error: Unable to retrieve redirect chain for {url}. {e}"
