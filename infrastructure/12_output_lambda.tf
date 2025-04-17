# Lambda function for AWS HealthScribe processing
resource "aws_lambda_function" "output_processor" {
  function_name = "output_status_processor"
  description   = "change the status of the recording in the database."
  
  # We'll use Python 3.9 runtime
  runtime       = "python3.12"
  handler       = "lambda_function.lambda_handler"
  
  filename      = "${path.module}/output_lambda/output_lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/output_lambda/output_lambda.zip")
  
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
  
  environment {
    variables = {
      # db_string = aws_db_instance.medi_sync_ai_db.endpoint,
      # db_user =  aws_db_instance.medi_sync_ai_db.username,
      # db_password = aws_db_instance.medi_sync_ai_db.password,
      # db_name = aws_db_instance.medi_sync_ai_db.db_name
    }
  }

  # Add depends_on to ensure proper deletion order
  depends_on = [
    aws_security_group.output_lambda_function,
    aws_subnet.az_1private_subnet_3,
    aws_subnet.az_2private_subnet_3,
    aws_iam_role_policy_attachment.lambda_network_policy_attachment
  ]
}

# Add this IAM policy attachment if not already present
resource "aws_iam_role_policy_attachment" "lambda_network_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.network_interface_policy.arn
}



resource "aws_iam_role_policy" "lambda_sqs_access_policy" {
  name = "lambda_sqs_access_policy"
  role = aws_iam_role.lambda_role.name // Replace with your actual Lambda role resource

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = aws_sqs_queue.output_status_update_queue.arn
      }
    ]
  })
}
