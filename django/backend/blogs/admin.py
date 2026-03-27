# blogs/admin.py

from django.contrib import admin
from .models import Blog

class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'created_at', 'image_url')
    search_fields = ('title', 'subtitle')
    readonly_fields = ('image_url',)  
admin.site.register(Blog, BlogAdmin)
