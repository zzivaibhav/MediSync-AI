resource "aws_cognito_user_pool" "doctor_registery" {
  name = "doctor_registery"
  username_attributes = ["email"]
  
  auto_verified_attributes = ["email"]
  
  # Define the required signup fields
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = true
  }
  
  schema {
    name                     = "phone_number"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = true
  }
  
  schema {
    name                     = "name"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = true
  }
 
  
  # Configure verification message
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject = "MediSync-AI - Verify your email"
    email_message = "Your verification code is {####}"
    sms_message = "Your verification code is {####}"
  }
  
  # Password policy (customize as needed)
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }
}



resource "aws_cognito_user_pool_client" "client" {
  name = "COGNITO_CLIENT"
    generate_secret = true
  user_pool_id =aws_cognito_user_pool.doctor_registery.id
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH","ALLOW_REFRESH_TOKEN_AUTH"]
  depends_on = [ aws_cognito_user_pool.doctor_registery ]
}
