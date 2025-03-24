resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name

  tags = {
    Name        = "medi-sync-ai-storage-1476"
    Environment = "Dev"
  }

  
}

