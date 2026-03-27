# blogs/utils.py

import boto3
import os
from botocore.exceptions import NoCredentialsError
from datetime import datetime

def generate_s3_key(image_name):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    base_name, ext = os.path.splitext(image_name)
    file_name = f"{base_name}_{timestamp}{ext}"
    return file_name

def upload_to_s3(file_obj, public=True):
    bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

    if not bucket_name or not aws_access_key or not aws_secret_key:
        print("Error: AWS credentials or bucket name are not set")
        return None

    s3 = boto3.client(
        's3',
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key
    )

    try:
        image_name = file_obj.name
        s3_key = generate_s3_key(image_name)

        s3.upload_fileobj(file_obj, bucket_name, s3_key)

        if public:
            url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
        else:
            url = s3.generate_presigned_url('get_object',
                                           Params={'Bucket': bucket_name,
                                                   'Key': s3_key},
                                           ExpiresIn=3600)  # URL expires in 1 hour

        print(f"Uploaded {s3_key} to bucket {bucket_name}, URL: {url}")
        return url

    except NoCredentialsError:
        print("Credentials not available")
        return None
    except Exception as e:
        print(f"Failed to upload {image_name}: {str(e)}")
        return None
