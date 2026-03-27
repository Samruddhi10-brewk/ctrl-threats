import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

# View to call the webscan API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def webscan(request):
    domain = request.GET.get('domain')
    if domain:
        WEBCHECK_API_URL = settings.WEBCHECK_API_URL
        try:
            logger.info(f"Calling webscan for domain: {domain} at {WEBCHECK_API_URL}webscan?domain={domain}")
            response = requests.get(f'{WEBCHECK_API_URL}webscan?domain={domain}', timeout=120)
            logger.info(f"Response status: {response.status_code}")
            if response.status_code == 200:
                return Response(response.json())
            else:
                logger.error(f"API returned status {response.status_code}: {response.text}")
                return Response({'error': f'API error: {response.status_code}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except requests.exceptions.Timeout:
            logger.error(f"Timeout calling webscan API")
            return Response({'error': 'Request timeout - scan is taking too long'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Connection error calling webscan API: {str(e)}")
            return Response({'error': f'Cannot reach backend API: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            logger.error(f"Unexpected error in webscan: {str(e)}")
            return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Domain is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_dns(request):
    domain = request.GET.get('domain')
    if domain:
        WEBCHECK_API_URL = settings.WEBCHECK_API_URL
        try:
            logger.info(f"Calling check_dns for domain: {domain}")
            response = requests.get(f'{WEBCHECK_API_URL}check_dns?domain={domain}', timeout=30)
            if response.status_code == 200:
                return Response(response.json())
            else:
                return Response({'error': f'API error: {response.status_code}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error in check_dns: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Domain is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def traceroute(request):
    domain = request.GET.get('domain')
    if domain:
        WEBCHECK_API_URL = settings.WEBCHECK_API_URL
        try:
            logger.info(f"Calling traceroute for domain: {domain}")
            response = requests.get(f'{WEBCHECK_API_URL}traceroute?domain={domain}', timeout=120)
            logger.info(f"API response status: {response.status_code}")
            
            try:
                response_data = response.json()
            except:
                logger.error(f"Invalid API response: {response.text}")
                return Response({'error': 'Invalid API response'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            if response.status_code in [200, 400]:
                return Response(response_data, status=response.status_code)
            else:
                logger.error(f"API error {response.status_code}: {response_data}")
                error_msg = response_data.get('error', f'API error {response.status_code}')
                return Response({'error': error_msg}, status=response.status_code)
        except requests.exceptions.Timeout:
            logger.error("Timeout in traceroute API call")
            return Response({'error': 'Request timeout'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Connection error: {str(e)}")
            return Response({'error': 'Cannot reach backend API'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Domain is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_favicon(request):
    domain = request.GET.get('domain')
    if domain:
        try:
            WEBCHECK_API_URL = settings.WEBCHECK_API_URL
            logger.info(f"Calling fetch_favicon for domain: {domain}")
            response = requests.get(f'{WEBCHECK_API_URL}favicon?domain={domain}', timeout=30)
            if response.status_code == 200:
                return Response(response.json())
            else:
                return Response({'error': 'Failed to fetch favicon from Flask API'}, status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error in fetch_favicon: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Domain is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_tls(request):
    domain = request.GET.get('domain')
    if domain:
        WEBCHECK_API_URL = settings.WEBCHECK_API_URL
        try:
            logger.info(f"Calling TLS check for domain: {domain}")
            response = requests.get(f'{WEBCHECK_API_URL}check-tls?domain={domain}', timeout=120)
            logger.info(f"TLS API response status: {response.status_code}")
            
            try:
                response_data = response.json()
            except:
                logger.error(f"Invalid TLS API response: {response.text}")
                return Response({'error': 'Invalid API response'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            if response.status_code in [200, 400, 503, 504]:
                return Response(response_data, status=response.status_code)
            else:
                logger.error(f"TLS API error {response.status_code}: {response_data}")
                error_msg = response_data.get('error', f'TLS check failed')
                return Response({'error': error_msg}, status=response.status_code)
        except requests.exceptions.Timeout:
            logger.error("TLS check timeout")
            return Response({'error': 'TLS check timed out - service is busy'}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Connection error: {str(e)}")
            return Response({'error': 'Cannot reach TLS service'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Domain is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def email_validate(request):
    if request.method == "POST":
        header_text = request.POST.get('header_text', '') or request.data.get('header_text', '')
        if not header_text:
            return Response({"error": "header_text is required"}, status=status.HTTP_400_BAD_REQUEST)
        EMAIL_API_URL = settings.EMAIL_API_URL
        try:
            logger.info(f"Sending request to Flask API at {EMAIL_API_URL}")
            response = requests.post(EMAIL_API_URL, data={"header_text": header_text})
            logger.info(f"Received response: {response.status_code} - {response.text}")
            try:
                json_response = response.json()
            except ValueError:
                logger.error(f"Invalid JSON response from Flask: {response.text}")
                return Response({"error": "Invalid JSON response from Flask API"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(json_response, status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.error(f"Request to Flask API failed: {str(e)}")
            return Response({"error": "Failed to reach Flask API", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"error": "Only POST method is allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)