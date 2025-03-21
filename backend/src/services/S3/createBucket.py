import logging
import boto3
from botocore.exceptions import ClientError


def create_bucket(bucket_name, region):
    """Create an S3 bucket in a specified region

    If a region is not specified, the bucket is created in the S3 default
    region (us-east-1).

    :param bucket_name: Bucket to create
    :param region: String region to create bucket in, e.g., 'us-west-2'
    :return: True if bucket created, else False
    """

    # Create bucket
    try:
        # Get the region from the session if none is provided
        session = boto3.session.Session()
        current_region = region or session.region_name or 'us-east-1'
        
        logging.info(f"Creating bucket '{bucket_name}' in region: {current_region}")
        
        # Always create client with explicit region to avoid endpoint confusion
        s3_client = boto3.client('s3', region_name=current_region)
        
        # us-east-1 is the only region that doesn't use a LocationConstraint
        if current_region == 'us-east-1':
            logging.info("Creating bucket in us-east-1 (no LocationConstraint needed)")
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            logging.info(f"Creating bucket with LocationConstraint: {current_region}")
            location = {'LocationConstraint': current_region}
            s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration=location
            )
    except ClientError as e:
        logging.error(f"Failed to create bucket '{bucket_name}'. Error: {e}")
        return False
    
    logging.info(f"Successfully created bucket: {bucket_name}")
    return True