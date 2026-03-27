from rest_framework import serializers
from .models import Blog

class BlogSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'subtitle', 'image_url', 'content_image_1_url', 'content_image_2_url', 'created_at', 'slug', 'meta_data']

class BlogDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'subtitle', 'image_url', 'content_image_1_url', 'content_image_2_url', 'content', 'created_at']
