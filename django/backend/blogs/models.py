from django.db import models
from django.utils import timezone
from django.utils.text import slugify
import hashlib
from .utils import upload_to_s3  # Import the S3 upload function

class Blog(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    image_file = models.ImageField(upload_to='temp_images/', blank=True, null=True)  # Temporary storage for the uploaded image
    image_url = models.URLField(max_length=1024, blank=True, null=True)  # S3 URL will be stored here
    content = models.TextField()
    
    # New fields for content images
    content_image_1 = models.ImageField(upload_to='temp_images/', blank=True, null=True)
    content_image_1_url = models.URLField(max_length=1024, blank=True, null=True)
    content_image_2 = models.ImageField(upload_to='temp_images/', blank=True, null=True)
    content_image_2_url = models.URLField(max_length=1024, blank=True, null=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=False)
    meta_data = models.JSONField(blank=True, null=True)  # New field to store JSON data

    def save(self, *args, **kwargs):
        # Upload main image if present
        if self.image_file:
            with self.image_file.open('rb') as image_file:
                s3_url = upload_to_s3(image_file)
                self.image_url = s3_url
            self.image_file = None  # Clear the local file

        # Upload content_image_1 if present
        if self.content_image_1:
            with self.content_image_1.open('rb') as image_file:
                s3_url = upload_to_s3(image_file)
                self.content_image_1_url = s3_url
            self.content_image_1 = None  # Clear the local file

        # Upload content_image_2 if present
        if self.content_image_2:
            with self.content_image_2.open('rb') as image_file:
                s3_url = upload_to_s3(image_file)
                self.content_image_2_url = s3_url
            self.content_image_2 = None  # Clear the local file

        # Generate slug if not already present
        if not self.slug:
            hash_value = hashlib.md5(self.title.encode()).hexdigest()[:8]
            self.slug = f"{slugify(self.title)}-{hash_value}"

        # Save the model instance
        super(Blog, self).save(*args, **kwargs)

    def __str__(self):
        return self.title
