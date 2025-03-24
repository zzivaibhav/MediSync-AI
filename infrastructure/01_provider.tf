terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}


# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
  # access_key = "ASIASB2KXKXIPWGIUO26"
  # secret_key = "FyIpZGzeGQER17Y6FI9Y0+xy2U9JWIdQnYDheH4/"
  
}