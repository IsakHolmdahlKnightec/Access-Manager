#!/bin/bash
# Bootstrap script for Terraform backend infrastructure
# Creates S3 bucket for state storage and DynamoDB table for state locking
#
# Usage:
#   ./bootstrap.sh                    # Uses default AWS profile
#   ./bootstrap.sh --profile prod     # Uses specified AWS profile
#   ./bootstrap.sh -p prod            # Short form
#   ./bootstrap.sh --help             # Show help

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
AWS_PROFILE=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--profile)
            AWS_PROFILE="$2"
            shift 2
            ;;
        --help)
            echo "Bootstrap script for Terraform backend infrastructure"
            echo ""
            echo "Usage:"
            echo "  ./bootstrap.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -p, --profile PROFILE    AWS profile to use (default: default)"
            echo "  --help                   Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./bootstrap.sh                    # Use default profile"
            echo "  ./bootstrap.sh --profile prod     # Use 'prod' profile"
            echo "  ./bootstrap.sh -p staging         # Use 'staging' profile"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Run './bootstrap.sh --help' for usage"
            exit 1
            ;;
    esac
done

# Build AWS CLI profile argument
AWS_PROFILE_ARG=""
if [ -n "$AWS_PROFILE" ]; then
    AWS_PROFILE_ARG="--profile $AWS_PROFILE"
    echo -e "${YELLOW}Using AWS profile: $AWS_PROFILE${NC}"
else
    echo -e "${YELLOW}Using default AWS profile${NC}"
fi

# Configuration
BUCKET_PREFIX="access-manager-terraform-state"
LOCK_TABLE="terraform-state-lock"
REGION="${AWS_REGION:-eu-north-1}"

# Get AWS account ID for unique bucket name
echo -e "${YELLOW}Getting AWS account information...${NC}"
ACCOUNT_ID=$(aws sts get-caller-identity $AWS_PROFILE_ARG --query "Account" --output text)
BUCKET_NAME="${BUCKET_PREFIX}-${ACCOUNT_ID}"

echo -e "${YELLOW}=== Terraform Backend Bootstrap ===${NC}"
echo "Region: $REGION"
echo "Account ID: $ACCOUNT_ID"
echo "Bucket Name: $BUCKET_NAME"
echo "Lock Table: $LOCK_TABLE"
if [ -n "$AWS_PROFILE" ]; then
    echo "AWS Profile: $AWS_PROFILE"
fi
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if user is authenticated
echo -e "${YELLOW}Checking AWS credentials...${NC}"
aws sts get-caller-identity $AWS_PROFILE_ARG > /dev/null 2>&1 || {
    echo -e "${RED}Error: AWS credentials not configured or invalid${NC}"
    if [ -n "$AWS_PROFILE" ]; then
        echo -e "${RED}Profile '$AWS_PROFILE' not found or not configured${NC}"
        echo "Available profiles:"
        aws configure list-profiles 2>/dev/null || echo "Unable to list profiles"
    fi
    exit 1
}
echo -e "${GREEN}✓ AWS credentials valid${NC}"
echo ""

# Create S3 bucket for Terraform state
echo -e "${YELLOW}Creating S3 bucket: $BUCKET_NAME${NC}"
if aws s3api head-bucket --bucket "$BUCKET_NAME" $AWS_PROFILE_ARG 2>/dev/null; then
    echo -e "${YELLOW}Bucket already exists${NC}"
else
    # Create bucket (different command for us-east-1 vs other regions)
    if [ "$REGION" == "us-east-1" ]; then
        aws s3api create-bucket \
            --bucket "$BUCKET_NAME" \
            --region "$REGION" \
            $AWS_PROFILE_ARG
    else
        aws s3api create-bucket \
            --bucket "$BUCKET_NAME" \
            --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION" \
            $AWS_PROFILE_ARG
    fi
    echo -e "${GREEN}✓ S3 bucket created${NC}"
fi

# Enable versioning on S3 bucket
echo -e "${YELLOW}Enabling versioning on S3 bucket...${NC}"
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled \
    $AWS_PROFILE_ARG
echo -e "${GREEN}✓ Versioning enabled${NC}"

# Enable encryption on S3 bucket
echo -e "${YELLOW}Enabling encryption on S3 bucket...${NC}"
aws s3api put-bucket-encryption \
    --bucket "$BUCKET_NAME" \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }' \
    $AWS_PROFILE_ARG
echo -e "${GREEN}✓ Encryption enabled${NC}"

# Block public access to S3 bucket
echo -e "${YELLOW}Blocking public access to S3 bucket...${NC}"
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    $AWS_PROFILE_ARG
echo -e "${GREEN}✓ Public access blocked${NC}"

# Create DynamoDB table for state locking
echo -e "${YELLOW}Creating DynamoDB table: $LOCK_TABLE${NC}"
if aws dynamodb describe-table --table-name "$LOCK_TABLE" --region "$REGION" $AWS_PROFILE_ARG 2>/dev/null; then
    echo -e "${YELLOW}DynamoDB table already exists${NC}"
else
    echo -e "${YELLOW}→ Creating DynamoDB table (this may take a moment)...${NC}"
    aws dynamodb create-table \
        --table-name "$LOCK_TABLE" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$REGION" \
        $AWS_PROFILE_ARG
    echo -e "${GREEN}✓ DynamoDB table created${NC}"
fi

# Wait for DynamoDB table to be active
echo -e "${YELLOW}Waiting for DynamoDB table to be active...${NC}"
echo -e "${YELLOW}(This may take 10-30 seconds, please wait...)${NC}"
aws dynamodb wait table-exists --table-name "$LOCK_TABLE" --region "$REGION" $AWS_PROFILE_ARG
echo -e "${GREEN}✓ DynamoDB table ready${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              🎉 BOOTSTRAP COMPLETE! 🎉                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "S3 Bucket: $BUCKET_NAME"
echo "DynamoDB Table: $LOCK_TABLE"
echo "Region: $REGION"
if [ -n "$AWS_PROFILE" ]; then
    echo "AWS Profile: $AWS_PROFILE"
fi
echo ""
echo -e "${GREEN}✓ All infrastructure successfully created!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update terraform.tfvars with your configuration"
if [ -n "$AWS_PROFILE" ]; then
    echo "  2. Run: export AWS_PROFILE=$AWS_PROFILE"
fi
echo "  3. Run: cd infrastructure && terraform init"
echo "  4. Run: terraform plan"
echo "  5. Run: terraform apply"
