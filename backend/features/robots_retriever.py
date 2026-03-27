import requests

def get_robots_txt(domain):
    try:
        # Construct the robots.txt URL
        url = f"https://{domain}/robots.txt"

        # Send a GET request to fetch the robots.txt file
        response = requests.get(url, timeout=10)  # Adding a timeout

        # Check if the robots.txt file exists
        if response.status_code == 200:
            # Return the content of the robots.txt file
            return response.text
        else:
            return f"No robots.txt file found for {domain} (Status code: {response.status_code})"
    except requests.exceptions.Timeout:
        return f"Error: Timeout while trying to retrieve robots.txt for {domain}."
    except requests.exceptions.RequestException as e:
        return f"Error: Unable to retrieve robots.txt for {domain}. {e}"
