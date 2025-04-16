resource "aws_security_group" "frontend" {
    name = "frontend-sg"
    description = "Allow SSH inbound traffic and http/https traffic in and out"
    vpc_id = aws_vpc.vpc.id  
    tags = {
        Name = "frontend-sg"
    }

    # ingress {
    #     from_port   = 22
    #     to_port     = 22
    #     protocol    = "tcp"
    #     cidr_blocks = ["0.0.0.0/0"]
    # }
    
    ingress {
        from_port       = 80
        to_port         = 80
        protocol        = "tcp"
        security_groups = [aws_security_group.application-load_balancer.id]
    }
    
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

 resource "aws_security_group" "backend" {
    name = "backend-sg"
    description = "Allow SSH inbound traffic and http/https traffic in and out"
    vpc_id = aws_vpc.vpc.id  
    tags = {
        Name = "backend-sg"
    }

    # ingress {
    #     from_port   = 22
    #     to_port     = 22
    #     protocol    = "tcp"
    #     cidr_blocks = ["0.0.0.0/0"]
    # }
    
    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}



resource "aws_security_group" "database" {
    name = "database-sg"
    description = "Allow MySQL Aurora inbound traffic and outbound traffic inside the vpc only."
    vpc_id = aws_vpc.vpc.id  
    tags = {
        Name = "database-sg"
    }

 
    
  ingress  {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]

  }

  ingress {
    from_port = 3306
    to_port   = 3306
    protocol  = "tcp"
    security_groups = [aws_security_group.output_lambda_function.id]
  }
  
    
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

 

 #sg for load balancer
 resource "aws_security_group" "application-load_balancer" {
    name = "lb-sg"
    description = "Allows HTTP and HTTPS traffic from the internet."
    vpc_id = aws_vpc.vpc.id  
    tags = {
        Name = "lb-sg"
    }

    # ingress {
    #     from_port   = 22
    #     to_port     = 22
    #     protocol    = "tcp"
    #     cidr_blocks = ["0.0.0.0/0"]
    # }
    
    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    
    ingress  {
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks =["0.0.0.0/0"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}


 resource "aws_security_group" "output_lambda_function" {
    name = "output-lambda-sg"
    description = "Allow traffic from the vpc"
    vpc_id = aws_vpc.vpc.id  
    tags = {
        Name = "output-lambda-sg"
    }
 
   
    
  
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}
