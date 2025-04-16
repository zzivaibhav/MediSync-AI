import json
import pymysql
import os
def lambda_handler(event, context):
   # Check if this is an SQS event or direct S3 event
   if 'Records' in event and len(event['Records']) > 0:
       # Process each record (could be from SQS or directly from S3)
       for record in event['Records']:
           # If this is an SQS message, parse the body to get the S3 event
           if 'body' in record:
               try:
                   sqs_body = json.loads(record['body'])
                   if 'Records' in sqs_body and len(sqs_body['Records']) > 0:
                       s3_event = sqs_body['Records'][0]
                   else:
                       continue
               except json.JSONDecodeError:
                   continue
           else:
               # This is a direct S3 event record
               s3_event = record
          
           # Process the S3 event
           if 's3' in s3_event:
               bucket = s3_event['s3']['bucket']['name']
               key = s3_event['s3']['object']['key']
               file_path = f"s3://{bucket}/{key}"
               prefix = key.split('/')[0]  # Gets everything before the first '/'
               print("Prefix before first slash:", prefix)
               print("File Path:", key)
              
               db_endpoint = os.environ['db_string'].split(':')
               host = db_endpoint[0]  # Just the hostname
               port = int(db_endpoint[1]) if len(db_endpoint) > 1 else 3306  # Default to 3306 if no port specified

               connection = pymysql.connect(
                    host=host,
                    port=port,
                    user=os.environ['db_user'],
                    password=os.environ['db_password'],
                    database=os.environ['db_name'],
                )
                            
               try:
                   with connection.cursor() as cursor:
                      # sql = "SELECT * FROM patient;"
                        sql = "UPDATE patient SET status = 'complete' WHERE email = %s"
                        cursor.execute(sql, (prefix))
                      # cursor.execute(sql)
                       
                   connection.commit()
               finally:
                   connection.close()
  
   return {"status": "success"}
