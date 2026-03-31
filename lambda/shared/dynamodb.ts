// ============================================================================
// DynamoDB Client and Utilities
// ============================================================================

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb"

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({})
export const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
})

// Table name from environment
export const getTableName = (): string => {
  const tableName = process.env.DYNAMODB_ACCESS_TABLE_NAME
  if (!tableName) {
    throw new Error("DYNAMODB_ACCESS_TABLE_NAME environment variable is not set")
  }
  return tableName
}

// Entity type constants
export const EntityType = {
  ACCESS: "ACCESS",
  REQUEST: "REQUEST",
  APPROVAL: "APPROVAL",
  NOTIFICATION: "NOTIFICATION",
  PROJECT: "PROJECT",
  TEAM: "TEAM",
} as const

// Status constants
export const RequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  DECLINED: "declined",
  CANCELLED: "cancelled",
  MORE_INFO: "more_info",
} as const

export type RequestStatusType =
  | (typeof RequestStatus)[keyof typeof RequestStatus]

// Access type constants
export const AccessType = {
  KUBERNETES: "kubernetes",
  AWS: "aws",
  WEB_SERVICE: "web_service",
  DATABASE: "database",
} as const

export type AccessTypeValue = (typeof AccessType)[keyof typeof AccessType]

// Duration constants
export const RequestDuration = {
  PERMANENT: "permanent",
  DAYS_30: "30_days",
  DAYS_90: "90_days",
} as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Get current ISO timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString()
}

/**
 * Parse pagination parameters from query string
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

export const parsePagination = (
  page?: string,
  pageSize?: string
): PaginationParams => {
  const defaultPageSize = 25
  const maxPageSize = 100

  const parsedPage = page ? parseInt(page, 10) : 1
  const parsedPageSize = pageSize ? parseInt(pageSize, 10) : defaultPageSize

  return {
    page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
    pageSize: isNaN(parsedPageSize)
      ? defaultPageSize
      : Math.min(parsedPageSize, maxPageSize),
  }
}

/**
 * Calculate DynamoDB scan offset
 */
export const calculateOffset = (page: number, pageSize: number): number => {
  return (page - 1) * pageSize
}
