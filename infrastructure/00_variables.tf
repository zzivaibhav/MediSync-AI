variable "bucket_name"{
    type = string
    default = "medi-sync-ai-storage-1476"
}

variable "vpc_name" {
  type = string
  default = "medi-sync-ai-secure-vpc-1476"
}
variable "region" {
  type = string
  default = "us-east-1"
}
variable "az-1" {

    type = string
    default = "us-east-1a" 
}

variable "az-2" {

    type = string
    default = "us-east-1b"  
}

variable "internet_gateway_name" {
  type = string
  default = "medi-sync-ai-igw-1476"
  
}

variable "az-1-rt-1" {
  type = string
    default = "module-1-az-1-rt"
}

variable "az-1-rt-2" {
  type = string
    default = "module-2-az-1-rt"
}
variable "az-1-rt-0" {
  type = string
    default = "module-0-az-1-rt"
}

variable "nat-allocation-id" {
    type = string
        default = "az-1-nat-alloc-id"
  
}


#variables for ec2 instances
variable "ec2_ami" {
  type = string
  default = "ami-08b5b3a93ed654d19"
  
}


#variables for db
variable "db_name" {
  type = string
  default = "medi_sync_ai_db1575"
  
}
variable "db_username" {
  type = string
  default = "root"
  
}

variable "db_password" {
  type = string
  default = "admin!vaibhav"
  
}