# =============================================================================
# Access Manager Data Table - Single Table Design
# =============================================================================

resource "aws_dynamodb_table" "access_data" {
  name         = var.access_data_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }

  attribute {
    name = "GSI2PK"
    type = "S"
  }

  attribute {
    name = "GSI2SK"
    type = "S"
  }

  attribute {
    name = "entityType"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "accessType"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  # Global Secondary Index 1 - For status-based queries
  # GSI1PK: "REQUEST#<status>" for pending request queries
  # GSI1SK: "<timestamp>" for chronological ordering
  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  # Global Secondary Index 2 - For access type queries
  # GSI2PK: "ACCESS#TYPE#<type>" for access type queries
  # GSI2SK: "ACCESS#<accessId>" for pagination
  global_secondary_index {
    name            = "GSI2"
    hash_key        = "GSI2PK"
    range_key       = "GSI2SK"
    projection_type = "ALL"
  }

  # DynamoDB Streams for change data capture
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Point-in-time recovery
  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  # Server-side encryption
  server_side_encryption {
    enabled = true
  }

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = var.access_data_table_name
    Application = var.project_name
    ManagedBy   = "Terraform"
  }
}

# =============================================================================
# Update Users Table - Add teamId, projectId, role attributes
# Note: This is done via the existing dynamodb module, but we reference the table here
# =============================================================================

data "aws_dynamodb_table" "users" {
  name = var.users_table_name
}
