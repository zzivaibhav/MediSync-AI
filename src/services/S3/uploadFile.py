import boto3
from botocore.exceptions import ClientError
import logging

def uploadObject(path, bucketName, objectName):
    """
    Upload a file to an S3 bucket
    
    :param path: File to upload
    :param bucketName: Bucket to upload to
    :param objectName: S3 object name
    :return: Dictionary containing status and message
    """
    s3 = boto3.client('s3')
    #process the object name.
    
    try:
        s3.upload_file(path, bucketName, objectName)
        return {
            "status": "success",
            "message": f"File {path} successfully uploaded to {bucketName}/{objectName}"
        }
    except FileNotFoundError:
        return {
            "status": "error",
            "message": f"The file {path} was not found"
        }
    except ClientError as e:
        logging.error(e)
        return {
            "status": "error",
            "message": f"Error uploading file: {str(e)}"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }
