# resource "aws_security_group" "frontend" {
#     name = "frontend-sg"
#     description = "Allow SSH inbound traffic and http/https traffic in and out"
#     vpc_id = aws_vpc.vpc.id  
#     tags = {
#         Name = "frontend-sg"
#     }

#     # ingress {
#     #     from_port   = 22
#     #     to_port     = 22
#     #     protocol    = "tcp"
#     #     cidr_blocks = ["0.0.0.0/0"]
#     # }
    
#     ingress {
#         from_port   = 80
#         to_port     = 80
#         protocol    = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
    
#     egress {
#         from_port   = 0
#         to_port     = 0
#         protocol    = "-1"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
# }

#  resource "aws_security_group" "backend" {
#     name = "backend-sg"
#     description = "Allow SSH inbound traffic and http/https traffic in and out"
#     vpc_id = aws_vpc.vpc.id  
#     tags = {
#         Name = "backend-sg"
#     }

#     # ingress {
#     #     from_port   = 22
#     #     to_port     = 22
#     #     protocol    = "tcp"
#     #     cidr_blocks = ["0.0.0.0/0"]
#     # }
    
#     ingress {
#         from_port   = 80
#         to_port     = 80
#         protocol    = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
    
#     egress {
#         from_port   = 0
#         to_port     = 0
#         protocol    = "-1"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
# }



# resource "aws_security_group" "database" {
#     name = "database-sg"
#     description = "Allow SSH inbound traffic and http/https traffic in and out"
#     vpc_id = aws_vpc.vpc.id  
#     tags = {
#         Name = "database-sg"
#     }

#     # ingress {
#     #     from_port   = 22
#     #     to_port     = 22
#     #     protocol    = "tcp"
#     #     cidr_blocks = ["0.0.0.0/0"]
#     # }
    
#     ingress {
#         from_port   = 80
#         to_port     = 80
#         protocol    = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
    
#     egress {
#         from_port   = 0
#         to_port     = 0
#         protocol    = "-1"
#         cidr_blocks = ["0.0.0.0/0"]
#     }
# }

 