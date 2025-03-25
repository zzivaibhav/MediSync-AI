# S3 Bucket
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  tags = {
    Name = "medi-sync-ai-storage-1476"
  }
}

# S3 Bucket Notification to Trigger Lambda
resource "aws_s3_bucket_notification" "s3_to_lambda" {
  bucket = aws_s3_bucket.bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.healthscribe_processor.arn
    events              = ["s3:ObjectCreated:*"]

    # Only trigger on objects within the "input/" folder (adjust the folder name accordingly)
    filter_prefix = "input/"
  }

  depends_on = [aws_lambda_permission.s3_invocation]
}

# Lambda Permission to Allow S3 to Invoke Lambda Function
resource "aws_lambda_permission" "s3_invocation" {
  statement_id  = "AllowS3Invocation"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.healthscribe_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.bucket.arn
}