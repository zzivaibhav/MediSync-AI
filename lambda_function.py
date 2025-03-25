import boto3
import json
import uuid
import os
from datetime import datetime
 
import time
def start_healthscribe_job(audio_file_uri, output_bucket, output_prefix):
    """
    Start an AWS HealthScribe job to process medical audio files.
    
    Args:
        audio_file_uri (str): S3 URI of the audio file to process
        output_bucket (str): S3 bucket where output should be stored
        output_prefix (str): Prefix for the output files in S3
        
    Returns:
        dict: Response from AWS HealthScribe service
    """
    # Initialize HealthScribe client
    healthscribe = boto3.client('transcribe')
    
    # Create a unique job name
    transcribe = f"healthscribe-job-{str(uuid.uuid4())[:8]}"
    print(f"{os.environ.get('HEALTHSCRIBE_ROLE_ARN')}")

    healthscribe.start_medical_scribe_job(
        MedicalScribeJobName = transcribe,
        Media = {
        'MediaFileUri': audio_file_uri
        },
        OutputBucketName = output_bucket,
        DataAccessRoleArn = os.environ.get('HEALTHSCRIBE_ROLE_ARN'),
        Settings = {
        'ShowSpeakerLabels': False,
        'ChannelIdentification': True
        },
        ChannelDefinitions = [
        {
            'ChannelId': 0, 
            'ParticipantRole': 'CLINICIAN'
        }, {
            'ChannelId': 1, 
            'ParticipantRole': 'PATIENT'
        }
        ]
    )

    while True:
        status = healthscribe.get_medical_scribe_job(MedicalScribeJobName = transcribe)
        if status['MedicalScribeJob']['MedicalScribeJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        print("Not ready yet...")
        time.sleep(5)    
    print(status)

def lambda_handler(event, context):
    return start_healthscribe_job("s3://audio-source-medisync-ai/vaibhav/input/1742610675462-diabetes-short.mp3", 
                                 "audio-source-medisync-ai", 
                                 "vaibhav/output/")