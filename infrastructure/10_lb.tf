#Target group for the frontend instances
 
resource "aws_lb_target_group" "frontend-tg" {
    name = "frontend-tg"
    port = 80
    protocol = "HTTP"
    target_type = "instance"
    vpc_id = aws_vpc.vpc.id
    depends_on = [aws_vpc.vpc]


  health_check {
    port                = 80
    protocol            = "HTTP"
    interval            = 10
    unhealthy_threshold = 2
    healthy_threshold   = 2
  }
 }

#Attaching the target group to the instances
 resource "aws_lb_target_group_attachment" "attach-ec2-az-1" {
   count = 1
   target_group_arn = aws_lb_target_group.frontend-tg.arn
    target_id = aws_instance.frontend-az-1.id
    depends_on = [aws_instance.frontend-az-1]
 }

 resource "aws_lb_target_group_attachment" "attach-ec2-az-2" {
   count = 1
   target_group_arn = aws_lb_target_group.frontend-tg.arn
    target_id = aws_instance.frontend-az-2.id
    depends_on = [aws_instance.frontend-az-2]
   
 }


 # creation of the application load balancer.
 resource "aws_lb" "frontend-lb" {
  name               = "frontend-lb-tf"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.application-load_balancer.id]
  subnets            = [aws_subnet.az_1public_subnet_1.id, aws_subnet.az_2public_subnet_1.id]
  
  enable_deletion_protection = false
 
  tags = {
    Environment = "production"
  }
}

# Create a listener for the load balancer -- attaching the tg with the load balancer
resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.frontend-lb.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend-tg.arn
  }
}


# backend target group
resource "aws_lb_target_group" "backend-tg" {
   name = "backend-tg"
    port = 80
    protocol = "HTTP"
    target_type = "instance"
    vpc_id = aws_vpc.vpc.id
    depends_on = [aws_vpc.vpc]


  health_check {
    port                = 80
    protocol            = "HTTP"
    path = "/test"
    interval            = 10
    unhealthy_threshold = 2
    healthy_threshold   = 2
  }
}

resource "aws_lb_target_group_attachment" "attach-ec2-backend-az-1" {
   count = 1
   target_group_arn = aws_lb_target_group.backend-tg.arn
    target_id = aws_instance.backend-az-1.id
    depends_on = [aws_instance.backend-az-1]
 }

 resource "aws_lb_target_group_attachment" "attach-ec2-backend-az-2" {
   count = 1
   target_group_arn = aws_lb_target_group.backend-tg.arn
    target_id = aws_instance.backend-az-2.id
    depends_on = [aws_instance.backend-az-2]
   
 }
  
  resource "aws_lb" "backend-lb" {
  name               = "backend-lb-tf"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.backend-load_balancer.id]
  #subnets            = [aws_subnet.az_1private_subnet_2.id, aws_subnet.az_2private_subnet_2.id]
  subnets            = [aws_subnet.az_1public_subnet_1.id, aws_subnet.az_2public_subnet_1.id]

  enable_deletion_protection = false
 
  tags = {
    Environment = "production"
  }
}

resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.backend-lb.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend-tg.arn
  }
  
} 