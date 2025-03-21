import boto3
from botocore.exceptions import ClientError
import logging

#add the folder name before the object name not at the end of the bucket name
def uploadObject(path, bucketName, objectName):
    """
    Upload a file to an S3 bucket
    
    :param path: File to upload
    :param bucketName: Bucket to upload to (just the bucket name, without any path)
    :param objectName: S3 object name (can include directory structure like "vaibhav/diabetes.ogg")
    :return: Dictionary containing status and message
    """
    s3 = boto3.client('s3')
    #process the object name.
    
    # Clean bucket name if it contains a directory structure
    if '/' in bucketName:
        parts = bucketName.split('/', 1)
        actual_bucket = parts[0]
        prefix = parts[1]
        objectName = f"{prefix}{objectName}"
        bucketName = actual_bucket
        logging.info(f"Corrected bucket name to {bucketName} and objectName to {objectName}")
    
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

if __name__ == "__main__":
    # Correct usage example - separate bucket name and object path
    uploadObject("/Users/vaibhav_patel/Documents/MediSync-AI/source/diabetes.ogg", 
                "audio-source-medisync-ai", "camel/diabetes.ogg")