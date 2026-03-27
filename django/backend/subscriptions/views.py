from rest_framework import generics
from .models import Subscription, Price, UserSubscription
from .serializers import SubscriptionSerializer, PriceSerializer, UserSubscriptionSerializer

class SubscriptionListCreateView(generics.ListCreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

class SubscriptionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

class PriceListCreateView(generics.ListCreateAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

class PriceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

class UserSubscriptionListCreateView(generics.ListCreateAPIView):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer

class UserSubscriptionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer
