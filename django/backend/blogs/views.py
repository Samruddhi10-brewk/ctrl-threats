# blogs/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Blog
from rest_framework.generics import RetrieveAPIView
from .serializers import BlogSummarySerializer, BlogDetailSerializer
class BlogSummaryAPIView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSummarySerializer(blogs, many=True)
        return Response(serializer.data)

class BlogDetailAPIView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogDetailSerializer(blogs, many=True)
        return Response(serializer.data)
    
class BlogDetailView(RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogDetailSerializer
    lookup_field = 'slug' 