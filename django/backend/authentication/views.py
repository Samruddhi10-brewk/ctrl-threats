from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from firebase_admin import auth as firebase_auth, exceptions as firebase_exceptions
from django.db import transaction
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from .serializers import SignupSerializer, LoginResponseSerializer, LoginSerializer, CustomUserDetailSerializer
from django.core.mail import send_mail
import os
from drf_yasg import openapi
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg import openapi
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class SignupView(APIView):
    @swagger_auto_schema(request_body=SignupSerializer)
    def post(self, request, *args, **kwargs):
        # recaptcha_response = verify_recaptcha(request.data.get('recaptcha_token'))
        # if not recaptcha_response['status']:
        #     return Response({'message': 'Invalid Captcha'}, status=status.HTTP_403_FORBIDDEN)

        email = request.data.get('email', '').lower()
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        username = request.data.get('username')

        if password != confirm_password:
            return Response({
                'message': 'Passwords do not match',
                'field': 'confirm_password'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not username:
            return Response({
                'message': 'Please enter a username',
                'field': 'username'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not email or not password:
            return Response({
                'message': 'Email and password are required',
                'field': 'email' if not email else 'password'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Check if user exists in our database first
                if User.objects.filter(email=email).exists():
                    return Response({
                        'message': 'An account with this email already exists',
                        'field': 'email'
                    }, status=status.HTTP_400_BAD_REQUEST)

                user = User.objects.create_user(
                    email=email,
                    username=username,
                    password=password,
                )

                try:
                    firebase_user = firebase_auth.create_user(
                        email=email,
                        password=password
                    )
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': {
                            'email': user.email,
                            'username': user.username
                        }
                    }, status=status.HTTP_201_CREATED)

                except firebase_exceptions.FirebaseError as e:
                    user.delete()
                    error_message = str(e)
                    if 'EMAIL_EXISTS' in error_message:
                        return Response({
                            'message': 'An account with this email already exists',
                            'field': 'email'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    return Response({
                        'message': 'Registration failed, please try again',
                        'error': error_message
                    }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'message': 'Registration failed, please try again later',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: LoginResponseSerializer,
            400: openapi.Response(
                description="Bad Request",
                examples={
                    "application/json": {
                        "message": "Invalid credentials",
                        "error": "Invalid email or password",
                        "code": "invalid_credentials"
                    }
                }
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={
                    "application/json": {
                        "message": "Invalid Captcha",
                        "code": "invalid_captcha"
                    }
                }
            ),
            500: openapi.Response(
                description="Internal Server Error",
                examples={
                    "application/json": {
                        "message": "Server error occurred",
                        "error": "Detailed error message",
                        "code": "server_error"
                    }
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        firebase_token = request.data.get('firebase_token')

        if not firebase_token:
            return Response({
                'message': 'Firebase token is required',
                'code': 'missing_token',
                'field': 'firebase_token'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token, clock_skew_seconds=5)
            uid = decoded_token['uid']
            email = decoded_token.get('email')

            if not email:
                return Response({
                    'message': 'Email is missing in the token',
                    'code': 'missing_email',
                    'field': 'email'
                }, status=status.HTTP_400_BAD_REQUEST)

            user, created = User.objects.get_or_create(email=email)

            if created:
                user.username = decoded_token.get('displayName', '')
                user.save()

            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'username': user.username,
                }
            }, status=status.HTTP_200_OK)

        except firebase_exceptions.ExpiredIdTokenError:
            return Response({
                'message': 'Firebase token has expired',
                'code': 'token_expired',
                'field': 'firebase_token'
            }, status=status.HTTP_400_BAD_REQUEST)
        except firebase_exceptions.InvalidIdTokenError:
            return Response({
                'message': 'Invalid Firebase token',
                'code': 'invalid_token',
                'field': 'firebase_token'
            }, status=status.HTTP_400_BAD_REQUEST)
        except firebase_exceptions.RevokedIdTokenError:
            return Response({
                'message': 'Firebase token has been revoked',
                'code': 'token_revoked',
                'field': 'firebase_token'
            }, status=status.HTTP_400_BAD_REQUEST)
        except firebase_exceptions.FirebaseError as e:
            return Response({
                'message': 'Firebase authentication failed',
                'error': str(e),
                'code': 'firebase_error',
                'field': 'firebase_token'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'message': 'Login failed',
                'error': str(e),
                'code': 'server_error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: LoginResponseSerializer,
            400: openapi.Response(
                description="Bad Request",
                examples={
                    "application/json": {"message": "Invalid Firebase token", "error": "Some error detail"}
                }
            ),
            403: openapi.Response(
                description="Forbidden",
                examples={
                    "application/json": {"message": "Invalid Captcha"}
                }
            ),
            500: openapi.Response(
                description="Internal Server Error",
                examples={
                    "application/json": {"message": "Error logging in", "error": "Detailed error message"}
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        # if not request.data.get('isOAuth'):
            # recaptcha_response = verify_recaptcha(request.data.get('recaptcha_token'))
            # if not recaptcha_response['status']:
            #     return Response({'message': 'Invalid Captcha'}, status=status.HTTP_403_FORBIDDEN)

        firebase_token = request.data.get('firebase_token')

        if not firebase_token:
            return Response({'message': 'Firebase token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_auth.verify_id_token(firebase_token, clock_skew_seconds=5)
            uid = decoded_token['uid']
            email = decoded_token.get('email')

            if not email:
                return Response({'message': 'Email is missing in the token'}, status=status.HTTP_400_BAD_REQUEST)

            user, created = User.objects.get_or_create(email=email)

            if created:
                user.username = decoded_token.get('displayName', '')
                user.save()

            refresh = RefreshToken.for_user(user)

            user_data = {
                'email': user.email,
                'username': user.username,
            }

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data
            }, status=status.HTTP_200_OK)

        except firebase_exceptions.FirebaseError as e:
            return Response({'message': 'Invalid Firebase token', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'message': 'Error logging in', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



def verify_recaptcha(token):
    """Verify the reCAPTCHA token with Google's API."""
    SERVER_RECAPTCHA_API = os.getenv('RECAPTCHA_SERVER_KEY')
    VERIFY_RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify'

    if not SERVER_RECAPTCHA_API:
        raise ValueError("RECAPTCHA_SERVER_KEY not set in environment variables")

    # Prepare query parameters for the GET request
    params = {
        'secret': SERVER_RECAPTCHA_API,
        'response': token
    }

    # Send GET request to Google's reCAPTCHA verification endpoint
    response = requests.get(VERIFY_RECAPTCHA_URL, params=params)
    # Parse the JSON response from Google's API
    response_json = response.json()

    # Check if verification was successful
    if response_json.get('success'):
        return {'status': True, 'message': 'Recaptcha Successful'}
    else:
        return {'status': False, 'message': 'Recaptcha Unsuccessful'}



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Retrieve the profile details of the authenticated user.",
        responses={
            200: CustomUserDetailSerializer(),
            401: openapi.Response(description="Authentication credentials were not provided."),
        }
    )
    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = CustomUserDetailSerializer(
            user,
            context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        operation_description="Update the profile details of the authenticated user.",
        request_body=CustomUserDetailSerializer,
        responses={
            200: CustomUserDetailSerializer(),
            400: openapi.Response(description="Invalid data provided."),
            401: openapi.Response(description="Authentication credentials were not provided."),
        }
    )
    def patch(self, request, *args, **kwargs):
        print("===== PROFILE UPDATE =====")
        print("User:", request.user)
        print("Authenticated:", request.user.is_authenticated)
        print("Data:", request.data)

        user = request.user

        serializer = CustomUserDetailSerializer(
            user,
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            print("Saved successfully")
            return Response(serializer.data)

        print("Errors:", serializer.errors)
        return Response(serializer.errors, status=400)
