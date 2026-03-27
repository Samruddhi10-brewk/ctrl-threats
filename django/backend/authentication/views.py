from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from firebase_admin import auth as firebase_auth

from .serializers import (
    SignupSerializer,
    LoginSerializer,
    LoginResponseSerializer,
    CustomUserDetailSerializer
)

User = get_user_model()


# =========================
# SIGNUP VIEW
# =========================
@method_decorator(csrf_exempt, name='dispatch')
class SignupView(APIView):

    @swagger_auto_schema(request_body=SignupSerializer)
    def post(self, request, *args, **kwargs):

        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()

                    refresh = RefreshToken.for_user(user)

                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': {
                            'email': user.email,
                            'username': user.username
                        }
                    }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({
                    'message': 'Registration failed',
                    'error': str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# LOGIN VIEW (FIXED)
# =========================
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: LoginResponseSerializer}
    )
    def post(self, request, *args, **kwargs):

        firebase_token = request.data.get("firebase_token")
        is_oauth = request.data.get("isOAuth", False)

        # =========================
        # 🔥 GOOGLE LOGIN
        # =========================
        if is_oauth and firebase_token:
            try:
                decoded_token = firebase_auth.verify_id_token(firebase_token)

                email = decoded_token.get('email')
                name = decoded_token.get('name', '')

                if not email:
                    return Response({
                        "message": "Email not found in token"
                    }, status=status.HTTP_400_BAD_REQUEST)

                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': name or email.split('@')[0]
                    }
                )

                refresh = RefreshToken.for_user(user)

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {
                        'email': user.email,
                        'username': user.username
                    }
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({
                    "message": "Invalid Firebase token",
                    "error": str(e)
                }, status=status.HTTP_401_UNAUTHORIZED)

        # =========================
        # 🔥 EMAIL/PASSWORD LOGIN
        # =========================
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({
                "message": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'username': user.username
            }
        }, status=status.HTTP_200_OK)


# =========================
# USER PROFILE VIEW
# =========================
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = CustomUserDetailSerializer(
            request.user,
            context={'request': request}
        )
        return Response(serializer.data)


# =========================
# UPDATE PROFILE VIEW
# =========================
class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, *args, **kwargs):

        serializer = CustomUserDetailSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)