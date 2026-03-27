import boto3
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny  # Change if needed
from .models import Contact
from .serializers import ContactSerializer


class ContactCreateView(APIView):
    permission_classes = [AllowAny]  # Change to IsAuthenticated if required

    def post(self, request, *args, **kwargs):
        serializer = ContactSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        contact = serializer.save()

        # Create SES client
        ses_client = boto3.client(
            "ses",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID_SES,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY_SES,
        )

        try:
            response = ses_client.send_email(
    Source=settings.SES_FROM_EMAIL,
    Destination={
        "ToAddresses": [settings.SES_TO_EMAIL],
    },
    Message={
        "Subject": {
            "Data": f"New Contact Form Submission from {contact.first_name}"
        },
        "Body": {
            "Text": {
                "Data": f"""
New Contact Form Submission

First Name: {contact.first_name}
Last Name: {contact.last_name}
Email: {contact.email}
Phone: {contact.phone_number}
Company: {contact.company_name}
Industry: {contact.industry}
Country: {contact.country}

Comments:
{contact.comments}
"""
            }
        },
    },
)


            return Response(
                {
                    "message": "Contact saved and email sent successfully",
                    "ses_message_id": response["MessageId"]
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {
                    "error": "Contact saved but email sending failed",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
