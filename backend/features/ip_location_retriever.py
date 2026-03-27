import requests  # type: ignore
import socket
import folium  # type: ignore
import os

# Function to get the IP address of a domain
def get_ip_address(domain):
    try:
        ip_address = socket.gethostbyname(domain)
        return ip_address
    except socket.gaierror:
        return None

# Function to fetch server location from a given API URL
def fetch_location_from_api(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 429:
            return "Error: Rate limit exceeded. Try again later."
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return f"Error: {str(e)}"

# Function to get server location using the primary service
def get_server_location(ip_address):
    url = f"http://ip-api.com/json/{ip_address}"
    data = fetch_location_from_api(url)
    if isinstance(data, str):  # Handle error messages
        return data

    if data.get("status") == "fail":
        return f"Error: {data.get('message', 'Unknown error')}"

    return {
        "IP Address": ip_address,
        "City": data.get("city"),
        "Country": data.get("country"),
        "Region": data.get("regionName"),
        "Latitude": data.get("lat"),
        "Longitude": data.get("lon"),
        "Timezone": data.get("timezone"),
        "Organization": data.get("org"),
    }

# Function to get server location using the fallback service
def get_fallback_location(ip_address):
    api_key = os.getenv("IPGEOLOCATION_API_KEY", "YOUR_API_KEY")  # Use environment variable for API key
    if api_key == "YOUR_API_KEY":
        return "Error: API key for fallback service is missing."

    url = f"https://api.ipgeolocation.io/ipgeo?apiKey={api_key}&ip={ip_address}"
    data = fetch_location_from_api(url)
    if isinstance(data, str):  # Handle error messages
        return data

    return {
        "IP Address": ip_address,
        "City": data.get("city"),
        "Country": data.get("country_name"),
        "Region": data.get("state_prov"),
        "Latitude": data.get("latitude"),
        "Longitude": data.get("longitude"),
        "Timezone": data.get("time_zone", {}).get("name"),
        "Organization": data.get("organization"),
    }

# Function to create a map and save it as an HTML file
def create_map(lat, lon, city, country, file_name="server_location_map.html"):
    try:
        map_view = folium.Map(location=[lat, lon], zoom_start=10)
        folium.Marker(
            [lat, lon],
            popup=f"<strong>{city}, {country}</strong>",
        ).add_to(map_view)
        map_view.save(file_name)
        print(f"Map saved as '{file_name}'")
    except Exception as e:
        print(f"Error creating map: {e}")

# Main execution block
if __name__ == "__main__":
    domain = input("Enter the domain (e.g., example.com): ")
    ip_address = get_ip_address(domain)
    if not ip_address:
        print("Error: Unable to resolve IP address.")
        exit()

    print(f"Resolved IP Address: {ip_address}")
    location = get_server_location(ip_address)

    # Fallback to alternate service if the primary service fails
    if not location or isinstance(location, str):
        print("Switching to fallback service...")
        location = get_fallback_location(ip_address)

    # Handle errors from both services
    if isinstance(location, str):
        print(location)
        exit()

    # Validate coordinates
    latitude = location.get("Latitude")
    longitude = location.get("Longitude")
    if latitude is None or longitude is None:
        print("Error: Missing latitude or longitude data.")
        exit()

    # Print location details
    print(f"City: {location['City']}")
    print(f"Region: {location['Region']}")
    print(f"Country: {location['Country']}")
    print(f"Latitude: {location['Latitude']}")
    print(f"Longitude: {location['Longitude']}")
    print(f"Timezone: {location['Timezone']}")
    print(f"Organization: {location['Organization']}")

    # Create the map
    create_map(
        float(latitude),
        float(longitude),
        location["City"],
        location["Country"],
    )
