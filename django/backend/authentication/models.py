from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('trials_left', extra_fields.get('free_trials', 5))  
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    free_trials = models.IntegerField(default=5)
    subscription_status = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )
    trials_left = models.IntegerField(default=5)
    created_at = models.DateTimeField(default=timezone.now)

    phone_number = models.CharField(max_length=15, blank=True, null=True)

    gender = models.CharField(
        max_length=10,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other')
        ],
        blank=True,
        null=True
    )

    birth_date = models.DateField(blank=True, null=True)

    #  Add these
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

    #  Correct ImageField
    profile_image = models.ImageField(
        upload_to='profiles/',
        null=True,
        blank=True
    )

    password = models.CharField(max_length=128)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
