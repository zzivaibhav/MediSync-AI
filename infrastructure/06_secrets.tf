//export cognito variables so that it can be used in the backend
# resource "aws_secretsmanager_secret" "medisync_secrets" {
#   name = "medisync_secrets_data"
# }

# variable "secrets" {
#   default = {}
# }

# Create a secret version with the actual values
resource "aws_secretsmanager_secret_version" "medisync_secret_version" {
  secret_id = "medisync_secrets_data"
  secret_string = jsonencode({
    DEMO = "DEMO"
    VITE_SERVER_URL = aws_lb.backend-lb.dns_name
    CORS_ORIGINS ="*"
    JWT_SECRET_KEY = "vaibhav"
    S3_INPUT_BUCKET_NAME = aws_s3_bucket.bucket.bucket
    S3_OUTPUT_BUCKET_NAME = aws_s3_bucket.output-bucket.bucket
    COGNITO_CLIENT_ID = aws_cognito_user_pool_client.client.id
    COGNITO_CLIENT_SECRET = aws_cognito_user_pool_client.client.client_secret
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.doctor_registery.id
    RDS_DATABASE_NAME = aws_db_instance.medi_sync_ai_db.db_name
    RDS_HOST = aws_db_instance.medi_sync_ai_db.address
    RDS_USERNAME = aws_db_instance.medi_sync_ai_db.username
    RDS_PASSWORD = aws_db_instance.medi_sync_ai_db.password 

  })

  depends_on = [ aws_cognito_user_pool.doctor_registery,aws_cognito_user_pool_client.client ]
}