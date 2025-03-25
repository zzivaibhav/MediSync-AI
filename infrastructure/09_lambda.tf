# # Lambda function for AWS HealthScribe processing
# resource "aws_lambda_function" "healthscribe_processor" {
#   function_name = "medisync_healthscribe_processor"
#   description   = "Processes medical audio files using AWS HealthScribe"
  
#   # We'll use Python 3.9 runtime
#   runtime       = "python3.9"
#   handler       = "lambda_function.lambda_handler"
  
#   # Create a deployment package from the code
#   filename      = "${path.module}/lambda.zip"
#   source_code_hash = filebase64sha256("${path.module}/lambda.zip")
  
#   # Set timeout to allow HealthScribe jobs to complete
#   timeout       = 900  # 15 minutes
#   memory_size   = 256
  
#   # IAM role for the Lambda function
#   role          = aws_iam_role.lambda_healthscribe_role.arn
  
#   # Environment variables
#   environment {
#     variables = {
#       HEALTHSCRIBE_ROLE_ARN = aws_iam_role.healthscribe_service_role.arn
#     }
#   }
# }

# # IAM role for the Lambda function
# resource "aws_iam_role" "lambda_healthscribe_role" {
#   name = "lambda_healthscribe_role"
  
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [{
#       Action = "sts:AssumeRole",
#       Effect = "Allow",
#       Principal = {
#         Service = "lambda.amazonaws.com"
#       }
#     }]
#   })
# }

# # IAM role for HealthScribe service to access S3
# resource "aws_iam_role" "healthscribe_service_role" {
#   name = "healthscribe_service_role"
  
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [{
#       Action = "sts:AssumeRole",
#       Effect = "Allow",
#       Principal = {
#         Service = "transcribe.amazonaws.com"
#       }
#     }]
#   })
# }

# # Attach policies to the Lambda role
# resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
#   role       = aws_iam_role.lambda_healthscribe_role.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

# # Custom policy for Lambda to use HealthScribe and access S3
# resource "aws_iam_policy" "lambda_healthscribe_policy" {
#   name        = "lambda_healthscribe_policy"
#   description = "Allow Lambda to start HealthScribe jobs and access S3"
  
#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action = [
#           "transcribe:StartMedicalScribeJob",
#           "transcribe:GetMedicalScribeJob",
#           "transcribe:ListMedicalScribeJobs",
#         ],
#         Effect   = "Allow",
#         Resource = "*"
#       },
#       {
#         Action = [
#           "s3:GetObject",
#           "s3:ListBucket"
#         ],
#         Effect   = "Allow",
#         Resource = [
#           "arn:aws:s3:::audio-source-medisync-ai",
#           "arn:aws:s3:::audio-source-medisync-ai/*"
#         ]
#       },
#       {
#         Action = [
#           "iam:PassRole"
#         ],
#         Effect   = "Allow",
#         Resource = aws_iam_role.healthscribe_service_role.arn
#       }
#     ]
#   })
# }

# # Attach custom policy to Lambda role
# resource "aws_iam_role_policy_attachment" "lambda_healthscribe_attachment" {
#   role       = aws_iam_role.lambda_healthscribe_role.name
#   policy_arn = aws_iam_policy.lambda_healthscribe_policy.arn
# }

# # S3 access policy for HealthScribe role
# resource "aws_iam_policy" "healthscribe_s3_access" {
#   name        = "healthscribe_s3_access"
#   description = "Allow HealthScribe to read from and write to S3"
  
#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action = [
#           "s3:GetObject",
#           "s3:PutObject",
#           "s3:ListBucket"
#         ],
#         Effect   = "Allow",
#         Resource = [
#           "arn:aws:s3:::audio-source-medisync-ai",
#           "arn:aws:s3:::audio-source-medisync-ai/*"
#         ]
#       }
#     ]
#   })
# }

# # Attach S3 access policy to HealthScribe role
# resource "aws_iam_role_policy_attachment" "healthscribe_s3_attachment" {
#   role       = aws_iam_role.healthscribe_service_role.name
#   policy_arn = aws_iam_policy.healthscribe_s3_access.arn
# }


