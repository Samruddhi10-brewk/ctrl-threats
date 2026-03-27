# contact/admin.py
from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone_number', 'company_name', 'industry', 'country')
    search_fields = ('first_name', 'last_name', 'email', 'company_name', 'industry', 'country')
    list_filter = ('industry', 'country')
    ordering = ('-id',)
