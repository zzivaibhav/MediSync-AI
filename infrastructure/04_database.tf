# resource "aws_db_subnet_group" "database_sb" {
#   name       = "medi-syb-ai-db-sb"
#   subnet_ids = [aws_subnet.az_2private_subnet_3.id, aws_subnet.az_1private_subnet_3.id]

#   tags = {
#     Name = "medi-syb-ai-db-sb"
#   }
# }

#  resource "aws_db_instance" "medi_sync_ai_db" {
#   identifier           = "medi-sync-ai-db"
#   allocated_storage    = 10
#   db_name              = var.db_name
#   engine               = "mysql"
#   engine_version       = "8.0"
#   instance_class       = "db.t3.micro"
#   username             = var.db_username
#   password             = var.db_password
#   parameter_group_name = "default.mysql8.0"
#    skip_final_snapshot  = true
#    vpc_security_group_ids = [aws_security_group.database.id]
#   db_subnet_group_name = aws_db_subnet_group.database_sb.name
   
#   tags = {
#     Name = "medi-sync-ai-db"
#     Identifier = "medi-sync-ai-db"
#   }
# }