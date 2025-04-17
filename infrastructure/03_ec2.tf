#instance declrations

resource "aws_instance" "frontend-az-1" {
    ami = var.ec2_ami
    
    instance_type = "t2.micro"
    subnet_id = aws_subnet.az_1private_subnet_1.id
    vpc_security_group_ids = [ aws_security_group.frontend.id ]
    associate_public_ip_address = true
    # instance_market_options {
    #   market_type = "spot"
    # }
    user_data  = file("user_data.sh")
    iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
    tags = {
        Name = "frontend-az-1"
    }
  depends_on = [ aws_security_group.frontend,aws_subnet.az_1private_subnet_1 ]
}

resource "aws_instance" "backend-az-1" {

    ami = var.ec2_ami
        iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    instance_type = "t2.micro"
    subnet_id = aws_subnet.az_1private_subnet_2.id
    vpc_security_group_ids = [ aws_security_group.frontend.id ]
    associate_public_ip_address = true
        user_data  = file("user_data.sh")
    # instance_market_options {
    #   market_type = "spot"
    # }
    tags = {
        Name = "backend-az-1"
    }
  
  depends_on = [ aws_security_group.backend,aws_subnet.az_1private_subnet_2]
}



resource "aws_instance" "frontend-az-2" {
    ami = var.ec2_ami
    instance_type = "t2.micro"
        iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    subnet_id = aws_subnet.az_2private_subnet_1.id
    vpc_security_group_ids = [ aws_security_group.frontend.id ]
    associate_public_ip_address = true
        user_data  = file("user_data.sh")
    # instance_market_options {
    #   market_type = "spot"
    # }
    tags = {
        Name = "frontend-az-2"
    }
  depends_on = [ aws_security_group.frontend,aws_subnet.az_2private_subnet_1 ]
}



resource "aws_instance" "backend-az-2" {

    ami = var.ec2_ami
    instance_type = "t2.micro"
        iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    subnet_id = aws_subnet.az_2private_subnet_2.id
    vpc_security_group_ids = [ aws_security_group.frontend.id ]
    associate_public_ip_address = true
        user_data  = file("user_data.sh")
    # instance_market_options {
    #   market_type = "spot"
    # }
    tags = {
        Name = "backend-az-2"
    }
  
  depends_on = [ aws_security_group.backend,aws_subnet.az_2private_subnet_2]
}