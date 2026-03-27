from rest_framework import serializers
from .models import CustomUser

from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'username',
            'phone_number',
            'gender',
            'birth_date',
            'country',
            'city',
            'profile_image',
            'subscription_status',
            'trials_left',
            'is_active',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        if instance.profile_image and request:
            data['profile_image'] = request.build_absolute_uri(
                instance.profile_image.url
            )

        return data

class CustomUserDetailSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = [
            'email',
            'username',
            'phone_number',
            'gender',
            'birth_date',
            'country',
            'city',
            'profile_image',
            'subscription_status',
            'trials_left'
        ]
        read_only_fields = ['email']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        if instance.profile_image and request:
            data['profile_image'] = request.build_absolute_uri(
                instance.profile_image.url
            )

        return data




class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    username = serializers.CharField()

class LoginSerializer(serializers.Serializer):
    firebase_token = serializers.CharField()
    recaptcha_token = serializers.CharField(required=False)  # Assuming this is only needed for some cases
    isOAuth = serializers.BooleanField(default=False)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    oob_code = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

class LoginResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()
    user = serializers.DictField(child=serializers.CharField())