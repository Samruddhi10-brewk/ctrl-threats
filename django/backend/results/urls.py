from django.urls import path
from . import views

urlpatterns = [
    path('webscan', views.webscan, name='webscan'),
    path('check_dns', views.check_dns, name='check_dns'),
    path('traceroute', views.traceroute, name='traceroute'),
    path('check-tls', views.check_tls, name='check_tls'),
    path('email_validate', views.email_validate, name='email_validate'),
    path('fetch_favicon', views.fetch_favicon, name='fetch_favicon'),
]
