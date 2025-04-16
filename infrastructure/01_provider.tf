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

  access_key = "AKIAYQYUAUBR4HDGPEWL"
  secret_key = "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"
  #token = "IQoJb3JpZ2luX2VjEJr//////////wEaCXVzLXdlc3QtMiJIMEYCIQCOzuoVRn3OScDByzRsWEBVAspUXjlSRWodpAcTf7bKlAIhAORTUSKu5XpYnN1fXYYh651QN4lFWktzXCkLO/vtPkfZKqkCCCMQARoMMTQxMzUzNzY4NDAwIgx5ffDxHmoMcfwcoLYqhgJiHPDF8faF33hcWhb2ar1ZDsRxG5pMGl1esobcL1NHm8g0TbzXxj9ycbiKJ34p6bM8b744OlwDm56FNHH9K9LDZ6SZ0GgporWSTBY6E7IC7d+N6cFx8+nZ7qNB/VckRZTC5BdgNYvgYkjeBOqfWGkFGhxNU0xHBTfzakGR5vcqTXohSvzBs8u/OW2JwBVlod3ERvp+ML/Y1F10YsPqeII7lpPFnxscaep2G9WEroTLwelvMicQ+aOU/+NLemxxiXkEZenKaV0RQLPNOik4spk5JDq4qwC4zeqLeESOrdc5pTBd4vINT4G6prsEzrbkbEOP7XPhRokALUkQAkEvLYiCAYlvn5qmMM719r8GOpwBgeteuKAEpmiKWq3SCwng8vQDA7Y0Vt7R9d9iYY2a4FtNxeg1Z1tDEukFXZoTRdj6C6SgBqYcwitUuKqfBHZgXhSES2xx2SUkbXsq1RKjNrrvrMlKEFNYQYa56UxR0SNLG9CVd1zzsdPCkRLMPvoJHB5ZhVnT7+Jc3DeOPmkZARUIaNSL9ps6bUqWm56oDPULx+oIqLUDQBQphsO/"

}