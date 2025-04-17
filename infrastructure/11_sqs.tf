resource "aws_sqs_queue" "output_status_update_queue" {
    name = "output_status_update_queue"
    delay_seconds = 15
    max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

}


// define the policy for the sqs queue which allows the sendmessage from the s3

data "aws_iam_policy_document" "sqs_s3_policy" {
  policy_id = "Policy1744730500910"
  version = "2012-10-17"
  
  statement {
    sid     = "Stmt1744730499845"
    actions = ["sqs:SendMessage"]
    effect  = "Allow"
    resources = [aws_sqs_queue.output_status_update_queue.arn]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_s3_bucket.output-bucket.arn]
    }
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

//attach the policy to the sqs queue
resource "aws_sqs_queue_policy" "output_processing_policy" {
  queue_url = aws_sqs_queue.output_status_update_queue.id
  policy = data.aws_iam_policy_document.sqs_s3_policy.json

  depends_on = [ aws_sqs_queue.output_status_update_queue  ]
}