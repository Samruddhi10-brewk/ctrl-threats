import socket
import concurrent.futures

def scan_port(host, port):
    """
    Try to connect to a port on the given host.
    Returns True if the port is open, False otherwise.
    """
    try:
        # Create a socket object
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # Set a timeout for the connection attempt (e.g., 1 second)
        s.settimeout(3)  # Reduced timeout for faster scanning
        # Attempt to connect to the host and port
        result = s.connect_ex((host, port))
        # Close the socket
        s.close()
        # Return the port and whether it is open (result == 0)
        return port, result == 0
    except socket.error as e:
        print(f"Error connecting to {host} on port {port}: {e}")
        return port, False

def scan_common_ports(host):
    """
    Scans common ports (from an expanded list) on the given host to check if they are open.
    """
    common_ports = [
        20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 119, 123, 143, 156,
        161, 162, 179, 194, 389, 443, 465, 587, 993, 995, 3000, 3306,
        3389, 5060, 5432, 5900, 8000, 8080, 8443, 8888
    ]
    open_ports = []
    print(f"Scanning {host} for open ports...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
        # Use a dictionary to hold future results
        future_to_port = {executor.submit(scan_port, host, port): port for port in common_ports}
        for future in concurrent.futures.as_completed(future_to_port):
            port, is_open = future.result()
            if is_open:
                print(f"Port {port} is open.")
                open_ports.append(port)
            else:
                print(f"Port {port} is closed.")

    if open_ports:
        print(f"Open ports on {host}: {open_ports}")
    else:
        print(f"No open ports found on {host}.")

    return open_ports