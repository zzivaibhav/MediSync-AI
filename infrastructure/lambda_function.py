def lambda_handler(event, context):
    response = {
        'statusCode': 200,
        'body': 'Hello World'
    }
    
    # Print the response to CloudWatch logs
    print(response)
    
    # Correctly access the S3 object key using dictionary notation
    try:
        # For S3 event notifications
        print(event['Records'][0]['s3']['bucket']['name'])
        print(event['Records'][0]['s3']['object']['key'])
    except KeyError:
        print("S3 object key not found in the event. Event structure:", event)
        
    return response
