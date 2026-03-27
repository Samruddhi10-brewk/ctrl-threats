import subprocess
import re
import sys
import json
import logging
import socket
import platform
import shutil

logger = logging.getLogger(__name__)

def trace_route_handler(url_string):
    try:
        url_object = re.search(r'^(?:https?://)?([^/]+)', url_string)
        if not url_object:
            raise ValueError('Invalid URL provided')
        host = url_object.group(1)
        
        traceroute_result = perform_traceroute(host)
        response = {"result": traceroute_result}
        return json.dumps(response, indent=2)
    except Exception as e:
        logger.error(f"Error in trace_route_handler: {str(e)}")
        return json.dumps({"error": str(e)}, indent=2)

def check_command_exists(command):
    """Check if a command exists on the system"""
    return shutil.which(command) is not None

def perform_traceroute(host):
    """
    Perform traceroute to a host and return the output as a formatted string
    """
    try:
        logger.info(f"Starting traceroute to {host}")
        
        # Validate hostname
        try:
            resolved_ip = socket.gethostbyname(host)
            logger.info(f"Resolved {host} to {resolved_ip}")
        except socket.gaierror as e:
            logger.error(f"Failed to resolve hostname {host}")
            raise ValueError(f"Cannot resolve hostname '{host}'. Please check the domain name.")
        
        # Check if traceroute is available
        if sys.platform == 'win32':
            cmd_name = 'tracert'
        else:
            cmd_name = 'traceroute'
        
        if not check_command_exists(cmd_name):
            logger.error(f"Command '{cmd_name}' not found on system")
            raise ValueError(f"Traceroute command not available. Please install traceroute package:\n"
                           f"  Linux: apt-get install traceroute\n"
                           f"  macOS: brew install traceroute\n"
                           f"  Windows: tracert is built-in")
        
        # Build command based on platform
        if sys.platform == 'win32':
            command = ['tracert', '-h', '30', host]
        else:
            # Linux/Mac traceroute command
            command = ['traceroute', '-n', '-m', '30', '-w', '5', '-q', '1', host]
        
        logger.info(f"Executing: {' '.join(command)}")
        
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=120
            )
            
            logger.info(f"Command returned code: {result.returncode}")
            
            # Get output (prefer stdout, fallback to stderr)
            output = result.stdout.strip() if result.stdout.strip() else result.stderr.strip()
            
            if not output:
                logger.warning(f"No output from traceroute for {host}")
                return f"Traceroute completed but no output received.\nResolved IP: {resolved_ip}\n\nThis may indicate:\n- All hops timed out\n- Host is blocking ICMP\n- Network issue"
            
            logger.info(f"Traceroute completed successfully for {host}")
            return output
            
        except subprocess.TimeoutExpired:
            logger.error(f"Traceroute timeout for {host}")
            raise ValueError(f"Traceroute timed out after 120 seconds")
        except FileNotFoundError:
            logger.error("Traceroute command not found")
            raise ValueError("Traceroute not installed. Install with: apt-get install traceroute")
        except PermissionError:
            logger.error("Permission denied executing traceroute")
            raise ValueError("Permission denied - traceroute requires elevated privileges")
        except OSError as e:
            logger.error(f"OS error: {str(e)}")
            raise ValueError(f"Failed to execute traceroute: {str(e)}")
            
    except ValueError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in perform_traceroute: {type(e).__name__}: {str(e)}")
        raise ValueError(f"Traceroute error: {str(e)}")