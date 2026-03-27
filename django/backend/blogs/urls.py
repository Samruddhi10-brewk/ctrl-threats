# blogs/urls.py

from django.urls import path
from .views import BlogSummaryAPIView, BlogDetailAPIView, BlogDetailView

urlpatterns = [
    path('blogs/summary/', BlogSummaryAPIView.as_view(), name='blog-summary'),
    path('blogs/<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/detail/', BlogDetailAPIView.as_view(), name='blog-detail'),
]
