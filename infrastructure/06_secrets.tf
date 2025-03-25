//export cognito variables so that it can be used in the backend
resource "aws_secretsmanager_secret" "medisync_secrets" {
  name = "medisync_secrets_va//ult"
}

variable "secrets" {
  default = {}
}

# Create a secret version with the actual values
resource "aws_secretsmanager_secret_version" "medisync_secret_version" {
  secret_id = aws_secretsmanager_secret.medisync_secrets.id
  secret_string = jsonencode({
    COGNITO_CLIENT_ID = aws_cognito_user_pool_client.client.id
    COGNITO_CLIENT_SECRET = aws_cognito_user_pool_client.client.client_secret
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.doctor_registery.id
    # RDS_DATABASE_NAME = aws_db_instance.default.db_name
    # RDS_ENDPOINT = aws_db_instance.default.endpoint
    # RDS_USERNAME = aws_db_instance.default.username
    # RDS_PASSWORD = aws_db_instance.default.password 

  })

  depends_on = [ aws_cognito_user_pool.doctor_registery,aws_cognito_user_pool_client.client ]
}