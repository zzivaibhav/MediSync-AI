import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def create_folder(bucket_name, folder_name):
    """
    Create a 'folder' in an S3 bucket.
    
    In S3, folders are virtual and implemented as prefixes with a trailing slash.
    This function creates an empty object with the folder name as the key
    and a trailing slash to simulate a folder.
    
    Args:
        bucket_name (str): The name of the existing S3 bucket.
        folder_name (str): The name of the folder to create.
    
    Returns:
        bool: True if folder was created successfully, False otherwise.
    """
    # Ensure the folder name ends with a slash
    if not folder_name.endswith('/'):
        folder_name += '/'
    
    try:
        # Create S3 client
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=os.environ.get("AWS_REGION")
        )
        
        # Create an empty object with the folder name as the key
        s3_client.put_object(
            Bucket=bucket_name,
            Key=folder_name
        )
        print(f"Successfully created folder '{folder_name}' in bucket '{bucket_name}'")
        return True
    
    except Exception as e:
        print(f"Error creating folder '{folder_name}' in bucket '{bucket_name}': {e}")
        return False
