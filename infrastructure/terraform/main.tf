# EyeD Infrastructure — Terraform
# Phase 1: PostgreSQL + basic compute
# Phase 2: IPFS, blockchain RPC, Redis cache

terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region for deployment"
  default     = "me-south-1" # Bahrain
}

variable "environment" {
  description = "Environment name"
  default     = "staging"
}

# Phase 1 resources will be defined here:
# - RDS PostgreSQL
# - ECS Fargate for API services
# - Secrets Manager
# - CloudWatch logging
