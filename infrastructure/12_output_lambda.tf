# Lambda function for AWS HealthScribe processing
resource "aws_lambda_function" "output_processor" {
  function_name = "output_status_processor"
  description   = "change the status of the recording in the database."
  
  # We'll use Python 3.9 runtime
  runtime       = "python3.12"
  handler       = "lambda_function.lambda_handler"
  
  # Create a deployment package from the code
  filename      = "${path.module}/output_lambda/output_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/output_lambda/output_lambda.zip")
  
  # Set timeout to allow HealthScribe jobs to complete
  timeout       = 900  # 15 minutes
  memory_size   = 256
  
    
    vpc_config {
        
        security_group_ids = [aws_security_group.output_lambda_function.id]
      subnet_ids = [ 
        aws_subnet.az_1private_subnet_3.id,
        aws_subnet.az_2private_subnet_3.id
       ]

    }
  role = aws_iam_role.lambda_role.arn
  # Environment variables
  environment {
    variables = {
    db_string = aws_db_instance.medi_sync_ai_db.endpoint,
    db_user =  aws_db_instance.medi_sync_ai_db.username,
    db_password = aws_db_instance.medi_sync_ai_db.password,
    db_name = aws_db_instance.medi_sync_ai_db.db_name
    }
  }
}
 