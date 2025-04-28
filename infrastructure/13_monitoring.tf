resource "aws_cloudwatch_dashboard" "resource_utilizaiton" {
  dashboard_name = "medisync-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", "InstanceId", "${aws_instance.frontend-az-1.id}", { "label": "Frontend AZ-1 CPU" }],
            ["AWS/EC2", "CPUUtilization", "InstanceId", "${aws_instance.frontend-az-2.id}", { "label": "Frontend AZ-2 CPU" }],
            ["AWS/EC2", "CPUUtilization", "InstanceId", "${aws_instance.backend-az-1.id}", { "label": "Backend AZ-1 CPU" }],
            ["AWS/EC2", "CPUUtilization", "InstanceId", "${aws_instance.backend-az-2.id}", { "label": "Backend AZ-2 CPU" }]
          ]
          period = 300
          stat   = "Average"
          region = var.region
          title  = "EC2 Instances CPU Utilization"
          view   = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EC2", "NetworkIn", "InstanceId", "${aws_instance.frontend-az-1.id}", { "label": "Frontend AZ-1" }],
            ["AWS/EC2", "NetworkIn", "InstanceId", "${aws_instance.frontend-az-2.id}", { "label": "Frontend AZ-2" }],
            ["AWS/EC2", "NetworkIn", "InstanceId", "${aws_instance.backend-az-1.id}", { "label": "Backend AZ-1" }],
            ["AWS/EC2", "NetworkIn", "InstanceId", "${aws_instance.backend-az-2.id}", { "label": "Backend AZ-2" }]
          ]
          period = 300
          stat   = "Average"
          region = var.region
          title  = "EC2 Instances Network In"
          view   = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EC2", "StatusCheckFailed", "InstanceId", "${aws_instance.frontend-az-1.id}", { "label": "Frontend AZ-1" }],
            ["AWS/EC2", "StatusCheckFailed", "InstanceId", "${aws_instance.frontend-az-2.id}", { "label": "Frontend AZ-2" }],
            ["AWS/EC2", "StatusCheckFailed", "InstanceId", "${aws_instance.backend-az-1.id}", { "label": "Backend AZ-1" }],
            ["AWS/EC2", "StatusCheckFailed", "InstanceId", "${aws_instance.backend-az-2.id}", { "label": "Backend AZ-2" }]
          ]
          period = 300
          stat   = "Maximum"
          region = var.region
          title  = "EC2 Status Checks"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EC2", "NetworkOut", "InstanceId", "${aws_instance.frontend-az-1.id}", { "label": "Frontend AZ-1" }],
            ["AWS/EC2", "NetworkOut", "InstanceId", "${aws_instance.frontend-az-2.id}", { "label": "Frontend AZ-2" }],
            ["AWS/EC2", "NetworkOut", "InstanceId", "${aws_instance.backend-az-1.id}", { "label": "Backend AZ-1" }],
            ["AWS/EC2", "NetworkOut", "InstanceId", "${aws_instance.backend-az-2.id}", { "label": "Backend AZ-2" }]
          ]
          period = 300
          stat   = "Average"
          region = var.region
          title  = "EC2 Instances Network Out"
          view   = "timeSeries"
          stacked = false
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/SQS", "ApproximateNumberOfMessagesVisible", "QueueName", "${aws_sqs_queue.output_status_update_queue.name}", { "label": "Messages Available" }],
            ["AWS/SQS", "ApproximateNumberOfMessagesNotVisible", "QueueName", "${aws_sqs_queue.output_status_update_queue.name}", { "label": "Messages In Flight" }],
            ["AWS/SQS", "ApproximateAgeOfOldestMessage", "QueueName", "${aws_sqs_queue.output_status_update_queue.name}", { "label": "Oldest Message Age" }]
          ]
          period = 300
          stat   = "Average"
          region = var.region
          title  = "SQS Queue Metrics"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", "${aws_lambda_function.output_processor.function_name}", { "label": "Output Processor Invocations" }],
            ["AWS/Lambda", "Errors", "FunctionName", "${aws_lambda_function.output_processor.function_name}", { "label": "Output Processor Errors" }],
            ["AWS/Lambda", "Duration", "FunctionName", "${aws_lambda_function.output_processor.function_name}", { "label": "Output Processor Duration" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.region
          title  = "Lambda Function Metrics"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/S3", "BucketSizeBytes", "BucketName", "${aws_s3_bucket.output-bucket.id}", "StorageType", "StandardStorage", { "label": "Output Bucket Size" }],
            ["AWS/S3", "NumberOfObjects", "BucketName", "${aws_s3_bucket.output-bucket.id}", "StorageType", "AllStorageTypes", { "label": "Number of Objects" }]
          ]
          period = 86400
          stat   = "Average"
          region = var.region
          title  = "S3 Bucket Metrics"
          view   = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ELB", "RequestCount", "LoadBalancerName", "${aws_lb.backend-lb.name}", { "label": "Backend LB Requests" }],
            ["AWS/ELB", "HTTPCode_Backend_5XX", "LoadBalancerName", "${aws_lb.backend-lb.name}", { "label": "Backend 5XX Errors" }],
            ["AWS/ELB", "HTTPCode_Backend_4XX", "LoadBalancerName", "${aws_lb.backend-lb.name}", { "label": "Backend 4XX Errors" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.region
          title  = "Load Balancer Metrics"
          view   = "timeSeries"
        }
      },
      {
        type   = "text"
        x      = 0
        y      = 24
        width  = 24
        height = 2

        properties = {
          markdown = "# **MediSync-AI Infrastructure Monitoring Dashboard**\nThis dashboard provides an overview of system performance and health across all critical infrastructure components."
        }
      }
    ]
  })
}