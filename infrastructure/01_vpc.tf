//create a virtual private cloud
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  instance_tenancy = "default"

  tags={
    Name = var.vpc_name
  }
}


//internet gateway for the VPC
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = var.internet_gateway_name
  }
  depends_on = [ aws_vpc.vpc ]
}

#subents for the VPC
//public subnet for NAT gateway in first AZ
resource "aws_subnet" "az_1public_subnet_1" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = var.az-1
  tags = {
    Name = "az-1-public-1"
  }
  depends_on = [ aws_vpc.vpc ]
}

// private subnet for frontend EC2 in the first AZ
resource "aws_subnet" "az_1private_subnet_1" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = var.az-1
  tags = {
    Name = "az-1-private-1"
  }
    depends_on = [ aws_vpc.vpc ]

}

// private subnet for backend EC2 in the first AZ
resource "aws_subnet" "az_1private_subnet_2" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = var.az-1
  tags = {
    Name = "az-1-private-2"
  }
    depends_on = [ aws_vpc.vpc ]

}

// private subnet for the database in first AZ
resource "aws_subnet" "az_1private_subnet_3" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.4.0/24"
  availability_zone = var.az-1
  tags = {
    Name = "az-1-private-3"
  }
    depends_on = [ aws_vpc.vpc ]

}

//public subnet for NAT gateway in second AZ
resource "aws_subnet" "az_2public_subnet_1" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.5.0/24"
  availability_zone = var.az-2
  tags = {
    Name = "az-2-public-1"
  }
  depends_on = [ aws_vpc.vpc ]
}

// private subnet for frontend EC2 in the second AZ
resource "aws_subnet" "az_2private_subnet_1" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.6.0/24"
  availability_zone = var.az-2
  tags = {
    Name = "az-2-private-1"
  }
    depends_on = [ aws_vpc.vpc ]
}

// private subnet for backend EC2 in the second AZ
resource "aws_subnet" "az_2private_subnet_2" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.7.0/24"
  availability_zone = var.az-2
  tags = {
    Name = "az-2-private-2"
  }
    depends_on = [ aws_vpc.vpc ]
}

//private subnet for standby database in the second AZ
resource "aws_subnet" "az_2private_subnet_3" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.8.0/24"
  availability_zone = var.az-2
  tags = {
    Name = "az-2-private-3"
  }
    depends_on = [ aws_vpc.vpc ]
}

#create route tables

//module-0 route table
resource "aws_route_table" "public-subnet-route-table-az-1" {
  vpc_id =   aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
 
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
  tags = {
      Name = var.az-1-rt-0  

    }

    depends_on = [ aws_internet_gateway.igw, aws_subnet.az_1public_subnet_1 ]
}

//module-1 route table
resource "aws_route_table" "front-end-route-table-az-1" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
 
    route  {
        cidr_block = "0.0.0.0/0"
        gateway_id  =  aws_nat_gateway.nat-1.id
    }
    
    tags = {
      Name = var.az-1-rt-1  

    }

 depends_on = [ aws_internet_gateway.igw,aws_vpc.vpc, aws_nat_gateway.nat-1 , aws_subnet.az_1private_subnet_1]
}

//module-2 route table
resource "aws_route_table" "backend-route-table-az-1" {
  vpc_id =   aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat-1.id
  }
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
  tags = {
      Name = var.az-1-rt-2

    }

    depends_on = [ aws_internet_gateway.igw, aws_subnet.az_1private_subnet_2 ]
}

resource "aws_route_table" "database-route-table-az-1" {
  vpc_id = aws_vpc.vpc.id
 route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
 route {
  cidr_block = "0.0.0.0/0"
  gateway_id = aws_nat_gateway.nat-1.id
 }
 tags = {
   Name = "module-3-az-1-rt"
 }
  depends_on = [ aws_subnet.az_1private_subnet_3 ]
}



// module - 0 route table az -2
resource "aws_route_table" "public-subnet-route-table-az-2" {
  vpc_id =   aws_vpc.vpc.id
 
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
 
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
  tags = {
      Name = "module-0-az-2-rt" 

    }

    depends_on = [ aws_internet_gateway.igw, aws_subnet.az_2public_subnet_1]
}

//module-1 route table
resource "aws_route_table" "front-end-route-table-az-2" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
 
    route  {
        cidr_block = "0.0.0.0/0"
        gateway_id  =  aws_nat_gateway.nat-2.id
    }
    
    tags = {
      Name = "module-1-az-2-rt"

    }

 depends_on = [ aws_internet_gateway.igw,aws_vpc.vpc, aws_nat_gateway.nat-2 , aws_subnet.az_2private_subnet_1]
}

//module-2 route table
resource "aws_route_table" "backend-route-table-az-2" {
  vpc_id =   aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat-2.id
  }
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
  tags = {
      Name = "module-2-az-2-rt"

    }

    depends_on = [ aws_internet_gateway.igw, aws_subnet.az_2private_subnet_2]
}


//module - 3 route table
resource "aws_route_table" "database-route-table-az-2" {
  vpc_id = aws_vpc.vpc.id
 route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
 }
 route {
  cidr_block = "0.0.0.0/0"
  gateway_id = aws_nat_gateway.nat-2.id
 }
 tags = {
   Name = "module-3-az-2-rt"
 }
  depends_on = [ aws_subnet.az_2private_subnet_3 ]
}



//create elastic ip for the NAT gateway in az-1
resource "aws_eip" "eip" {

  tags = {
    Name = "NAT-EIP-1"
  }
}

resource "aws_eip" "eip2" {
  tags = {
    Name = "NAT-EIP-2"
  }
}


//create a NAT gateway in az-1
resource "aws_nat_gateway" "nat-1" {
  allocation_id = aws_eip.eip.id
  subnet_id     = aws_subnet.az_1public_subnet_1.id

  tags = {
    Name = "NAT-1"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_vpc.vpc,aws_internet_gateway.igw,aws_subnet.az_1public_subnet_1]
}

//create a NAT gateway in az-2
resource "aws_nat_gateway" "nat-2" {
  allocation_id = aws_eip.eip2.id
  subnet_id     = aws_subnet.az_2public_subnet_1.id

  tags = {
    Name = "NAT-2"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_vpc.vpc,aws_internet_gateway.igw,aws_subnet.az_2public_subnet_1]
}


#route table associations.
//route table association with the public subnet

resource "aws_route_table_association" "module-0-rt-association-az-1" {
    subnet_id      = aws_subnet.az_1public_subnet_1.id
    route_table_id = aws_route_table.public-subnet-route-table-az-1.id  
    depends_on = [ aws_subnet.az_1public_subnet_1,aws_route_table.public-subnet-route-table-az-1 ]
  
}
resource "aws_route_table_association" "module-0-rt-association-az-2" {
    subnet_id      = aws_subnet.az_2public_subnet_1.id
    route_table_id = aws_route_table.public-subnet-route-table-az-2.id
    depends_on = [ aws_subnet.az_2public_subnet_1,aws_route_table.public-subnet-route-table-az-2 ]
  
}



resource "aws_route_table_association" "module-1-rt-association-az-1" {
    subnet_id      = aws_subnet.az_1private_subnet_1.id
    route_table_id = aws_route_table.front-end-route-table-az-1.id  
    depends_on = [ aws_subnet.az_1private_subnet_1,aws_route_table.front-end-route-table-az-1]
    
}
resource "aws_route_table_association" "module-1-rt-association-az-2" {
    subnet_id      = aws_subnet.az_2private_subnet_1.id
    route_table_id = aws_route_table.front-end-route-table-az-2.id  
    depends_on = [ aws_subnet.az_2private_subnet_1,aws_route_table.front-end-route-table-az-2 ]
}


//module -2 route table association with the private subnet 
resource "aws_route_table_association" "module-2-rt-association-az-1" {
    subnet_id      = aws_subnet.az_1private_subnet_2.id
    route_table_id = aws_route_table.backend-route-table-az-1.id  
    depends_on = [ aws_subnet.az_1private_subnet_2,aws_route_table.backend-route-table-az-1 ] 
}

resource "aws_route_table_association" "module-2-rt-association-az-2" {
    subnet_id      = aws_subnet.az_2private_subnet_2.id
    route_table_id = aws_route_table.backend-route-table-az-2.id  
    depends_on = [ aws_subnet.az_1private_subnet_2,aws_route_table.backend-route-table-az-2 ] 
}

//module -3 route table association with the private subnet
resource "aws_route_table_association" "module-3-rt-association-az-1" {
    subnet_id      = aws_subnet.az_1private_subnet_3.id
    route_table_id = aws_route_table.database-route-table-az-1.id  
    depends_on = [ aws_subnet.az_1private_subnet_3,aws_route_table.database-route-table-az-1 ] 
}

resource "aws_route_table_association" "module-3-rt-association-az-2" {
    subnet_id      = aws_subnet.az_2private_subnet_3.id
    route_table_id = aws_route_table.database-route-table-az-2.id  
    depends_on = [ aws_subnet.az_2private_subnet_3,aws_route_table.database-route-table-az-2 ] 
}