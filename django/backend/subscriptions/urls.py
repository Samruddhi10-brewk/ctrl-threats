from django.urls import path
from .views import (
    SubscriptionListCreateView, SubscriptionRetrieveUpdateDestroyView,
    PriceListCreateView, PriceRetrieveUpdateDestroyView,
    UserSubscriptionListCreateView, UserSubscriptionRetrieveUpdateDestroyView
)

urlpatterns = [
    path('subscriptions/', SubscriptionListCreateView.as_view(), name='subscription-list-create'),
    path('subscriptions/<int:pk>/', SubscriptionRetrieveUpdateDestroyView.as_view(), name='subscription-detail'),
    path('prices/', PriceListCreateView.as_view(), name='price-list-create'),
    path('prices/<int:pk>/', PriceRetrieveUpdateDestroyView.as_view(), name='price-detail'),
    path('user-subscriptions/', UserSubscriptionListCreateView.as_view(), name='user-subscription-list-create'),
    path('user-subscriptions/<int:pk>/', UserSubscriptionRetrieveUpdateDestroyView.as_view(), name='user-subscription-detail'),
]
