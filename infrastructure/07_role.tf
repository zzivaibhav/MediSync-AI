# resource "aws_iam_role" "lambda_role" {
#   name = "processAudio-role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Effect = "Allow"
#       Principal = {
#         Service = "lambda.amazonaws.com"
#       }
#       Action = "sts:AssumeRole"
#     }]
#   })
# }

# resource "aws_iam_policy" "lambda_logging_policy" {
#   name        = "LambdaLoggingPolicy"
#   description = "Allows Lambda to write logs to CloudWatch"
  
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = "logs:CreateLogGroup"
#         Resource = "arn:aws:logs:us-east-1:585768149091:*"
#       },
#       {
#         Effect = "Allow"
#         Action = [
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ]
#         Resource = [
#           "arn:aws:logs:us-east-1:585768149091:log-group:/aws/lambda/processAudio:*"
#         ]
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "transcribe_access_policy" {
#   name        = "TranscribeAccessPolicy"
#   description = "Allows access to Amazon Transcribe services"
  
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         Action = ["transcribe:*"]
#         Resource = "*"
#       },
#       {
#         Effect = "Allow"
#         Action = ["s3:GetObject"]
#         Resource = ["arn:aws:s3:::*transcribe*"]
#       }
#     ]
#   })
# }

# resource "aws_iam_policy" "pass_role_policy" {
#   name        = "PassRoleForTranscribe"
#   description = "Allows Lambda to pass IAM role to Transcribe"
  
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect   = "Allow"
#         Action   = "iam:PassRole"
#         Resource = "arn:aws:iam::585768149091:role/service-role/AmazonTranscribeServiceRole-MediSyncTranscribeRole"
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "lambda_logs" {
#   role       = aws_iam_role.lambda_role.name
#   policy_arn = aws_iam_policy.lambda_logging_policy.arn
# }

# resource "aws_iam_role_policy_attachment" "transcribe_access" {
#   role       = aws_iam_role.lambda_role.name
#   policy_arn = aws_iam_policy.transcribe_access_policy.arn
# }

# resource "aws_iam_role_policy_attachment" "pass_role_attachment" {
#   role       = aws_iam_role.lambda_role.name
#   policy_arn = aws_iam_policy.pass_role_policy.arn
# }
