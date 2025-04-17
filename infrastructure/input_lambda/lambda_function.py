import boto3
import json
import uuid
import os
import time
from urllib.parse import urlparse

def start_healthscribe_job(audio_file_uri, output_bucket, output_prefix):
    """
    Start an AWS HealthScribe job to process medical audio files.
    
    Args:
        audio_file_uri (str): S3 URI of the audio file to process
        output_bucket (str): S3 bucket where output should be stored
        output_prefix (str): Prefix for the output files in S3 (not directly used as parameter)
        
    Returns:
        dict: Response from AWS HealthScribe service
    """
    # Initialize HealthScribe client
    healthscribe = boto3.client('transcribe')
    
    # Create a unique job name that includes the prefix for organization
    job_name = f"{output_prefix}"
    # Remove any leading or trailing hyphens
    job_name = job_name.strip('-')
    
    print(f"Starting HealthScribe job: {job_name}")
    print(f"Using IAM Role: {os.environ.get('HEALTHSCRIBE_ROLE_ARN')}")

    response = healthscribe.start_medical_scribe_job(
        MedicalScribeJobName=job_name,
        Media={
            'MediaFileUri': audio_file_uri
        },
        OutputBucketName=output_bucket,
        DataAccessRoleArn=os.environ.get('HEALTHSCRIBE_ROLE_ARN'),
        Settings={
            'ShowSpeakerLabels': False,
            'ChannelIdentification': True
        },
        ChannelDefinitions=[
            {
                'ChannelId': 0, 
                'ParticipantRole': 'CLINICIAN'
            }, 
            {
                'ChannelId': 1, 
                'ParticipantRole': 'PATIENT'
            }
        ]
    )

    # Wait for job completion
    start_time = time.time()
    max_wait_time = 840  # 14 minutes (leaving buffer for Lambda's 15 min limit)
    
    while True:
        # Check if we're approaching Lambda timeout
        if time.time() - start_time > max_wait_time:
            print(f"Approaching Lambda timeout limit after {max_wait_time} seconds. Job is still running.")
            # Return the current status without waiting for completion
            return healthscribe.get_medical_scribe_job(MedicalScribeJobName=job_name)
            
        status = healthscribe.get_medical_scribe_job(MedicalScribeJobName=job_name)
        job_status = status['MedicalScribeJob']['MedicalScribeJobStatus']
        
        if job_status in ['COMPLETED', 'FAILED']:
            print(f"Job {job_name} finished with status: {job_status}")
            break
            
        print(f"Job status: {job_status} - waiting...")
        time.sleep(30)  # Check every 30 seconds instead of 5 to reduce API calls
        
    return status

def lambda_handler(event, context):
    """
    Lambda handler that processes S3 events and starts HealthScribe jobs.
    
    Args:
        event (dict): Lambda event containing S3 event data
        context (object): Lambda context
    
    Returns:
        dict: Response containing job status and details
    """
    print("Received event:", json.dumps(event, indent=2))
    
    try:
        # Get the output bucket from environment variable
        output_bucket = os.environ.get('OUTPUT_BUCKET_NAME')
        if not output_bucket:
            raise ValueError("OUTPUT_BUCKET_NAME environment variable is not set")
        
        results = []
        
        # Process each record in the S3 event
        for record in event['Records']:
            # Extract S3 bucket and key info
            source_bucket = record['s3']['bucket']['name']
            source_key = record['s3']['object']['key']
            
           # Skip processing if this is not an audio file
            audio_extensions = ['.mp3', '.wav', '.flac', '.m4a', '.mp4', '.ogg']
            if not any(source_key.lower().endswith(ext) for ext in audio_extensions):
                print(f"Skipping non-audio file: {source_key}")
                continue
                
            print(f"Processing file s3://{source_bucket}/{source_key}")
            
            # Create S3 URI for input file
            audio_file_uri = f"s3://{source_bucket}/{source_key}"
            
            # Extract the prefix (everything before the last slash) for the output
            key_parts = source_key.split('/')
            if len(key_parts) > 1:
                # If key has slashes, use everything before the last slash as prefix
                output_prefix = '/'.join(key_parts[:-1]) 
            else:
                # If no slashes, use empty prefix
                output_prefix = ""
            
            print(f"Using output prefix: {output_prefix}")
            
            # Start the HealthScribe job
            job_status = start_healthscribe_job(
                audio_file_uri=audio_file_uri,
                output_bucket=output_bucket,
                output_prefix=output_prefix
            )
            
            results.append({
                'jobName': job_status['MedicalScribeJob']['MedicalScribeJobName'],
                'jobStatus': job_status['MedicalScribeJob']['MedicalScribeJobStatus'],
                'inputFile': audio_file_uri,
                'outputLocation': f"s3://{output_bucket}/"
            })
        
        # Return results for all processed records
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'HealthScribe processing initiated',
                'results': results
            })
        }
            
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error processing request: {str(e)}'
            })
        }