// ============================================================================
// Request Status Validation Helpers
// ============================================================================

import { RequestStatus } from "../shared/dynamodb"
import type { RequestStatusType } from "../shared/types"

/**
 * Valid status transitions for request lifecycle
 */
const VALID_TRANSITIONS: Record<RequestStatusType, RequestStatusType[]> = {
  [RequestStatus.PENDING]: [
    RequestStatus.APPROVED,
    RequestStatus.DECLINED,
    RequestStatus.CANCELLED,
    RequestStatus.MORE_INFO,
  ],
  [RequestStatus.MORE_INFO]: [
    RequestStatus.PENDING,
    RequestStatus.CANCELLED,
  ],
  [RequestStatus.APPROVED]: [],
  [RequestStatus.DECLINED]: [],
  [RequestStatus.CANCELLED]: [],
}

/**
 * Check if a status transition is valid
 */
export const isValidStatusTransition = (
  currentStatus: RequestStatusType,
  newStatus: RequestStatusType
): boolean => {
  const validNextStatuses = VALID_TRANSITIONS[currentStatus]
  return validNextStatuses.includes(newStatus)
}

/**
 * Check if a request can be cancelled
 */
export const canCancelRequest = (status: RequestStatusType): boolean => {
  return (
    status === RequestStatus.PENDING || status === RequestStatus.MORE_INFO
  )
}

/**
 * Check if a request can be approved
 */
export const canApproveRequest = (status: RequestStatusType): boolean => {
  return status === RequestStatus.PENDING
}

/**
 * Check if a request can be declined
 */
export const canDeclineRequest = (status: RequestStatusType): boolean => {
  return status === RequestStatus.PENDING
}

/**
 * Check if more info can be requested
 */
export const canRequestMoreInfo = (status: RequestStatusType): boolean => {
  return status === RequestStatus.PENDING
}

/**
 * Check if user can add more info (on more_info status)
 */
export const canAddMoreInfo = (status: RequestStatusType): boolean => {
  return status === RequestStatus.MORE_INFO
}

/**
 * Validate status value
 */
export const isValidStatus = (status: string): status is RequestStatusType => {
  return Object.values(RequestStatus).includes(status as RequestStatusType)
}

/**
 * Get all possible statuses
 */
export const getAllStatuses = (): RequestStatusType[] => {
  return Object.values(RequestStatus)
}
