def lambda_handler(event, context):
    response = {
        'statusCode': 200,
        'body': 'Hello World'
    }
    
    # Print the response to CloudWatch logs
    print(response)
    
    return response
