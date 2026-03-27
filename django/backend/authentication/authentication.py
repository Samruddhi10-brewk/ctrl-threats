from rest_framework.authentication import BaseAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed


class FirebaseAuthentication(BaseAuthentication):

    def authenticate(self, request):
        token_key = request.META.get('HTTP_AUTHORIZATION')
        if not token_key or not token_key.startswith('Token '):
            return None

        token_key = token_key[6:]
        try:
            # Validate Django token
            token = Token.objects.get(key=token_key)
            user = token.user
            return (user, token)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

    def authenticate_header(self, request):
        return 'Token'
