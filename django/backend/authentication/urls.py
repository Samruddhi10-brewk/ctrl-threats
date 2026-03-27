from django.urls import path
from .views import SignupView , LoginView , UserProfileView, UpdateUserProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # path('sample/', SampleView.as_view(), name='sample-view'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('updateuserprofile/', UpdateUserProfileView.as_view(), name='update_user_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
