"use client"

import * as React from "react"
import { usePendingRequests, useApproveRequest, useDeclineRequest, useRequestMoreInfo } from "@/lib/api"
import type { AccessRequest } from "@/lib/api/types"
import { EmptyState, EmptyStatePresets, SkeletonListItem } from "@/components/access"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function AdminApprovalsPage() {

  const { data, isLoading, error, refetch } = usePendingRequests()
  const approveRequest = useApproveRequest()
  const declineRequest = useDeclineRequest()
  const requestMoreInfo = useRequestMoreInfo()

  const [selectedRequest, setSelectedRequest] = React.useState<AccessRequest | null>(null)
  const [showDeclineModal, setShowDeclineModal] = React.useState(false)
  const [showInfoModal, setShowInfoModal] = React.useState(false)
  const [declineReason, setDeclineReason] = React.useState("")
  const [infoMessage, setInfoMessage] = React.useState("")

  const requests = data?.requests ?? []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest.mutateAsync(requestId)
      refetch()
    } catch {
      alert("Failed to approve request. Please try again.")
    }
  }

  const handleDecline = async () => {
    if (!selectedRequest || !declineReason.trim()) return

    try {
      await declineRequest.mutateAsync({
        requestId: selectedRequest.id,
        input: { reason: declineReason.trim() },
      })
      setShowDeclineModal(false)
      setSelectedRequest(null)
      setDeclineReason("")
      refetch()
    } catch {
      alert("Failed to decline request. Please try again.")
    }
  }

  const handleRequestMoreInfo = async () => {
    if (!selectedRequest || !infoMessage.trim()) return

    try {
      await requestMoreInfo.mutateAsync({
        requestId: selectedRequest.id,
        input: { message: infoMessage.trim() },
      })
      setShowInfoModal(false)
      setSelectedRequest(null)
      setInfoMessage("")
      refetch()
    } catch {
      alert("Failed to request more info. Please try again.")
    }
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-surface-container-low py-8 px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-headline-md font-semibold text-foreground">
            Pending Approvals
          </h1>
          <p className="mt-2 text-body-md text-muted-foreground">
            Review and respond to access requests from your team
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-body-md text-error">Failed to load requests</p>
            <Button variant="ghost" onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : requests.length === 0 ? (
          // Empty state
          <EmptyState {...EmptyStatePresets.noPendingApprovals} />
        ) : (
          // Request List
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{request.accessName}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Requested by {request.userName || request.userEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-medium uppercase">
                      {request.duration.replace("_", " ")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Justification</p>
                    <p className="mt-1 text-body-sm text-foreground line-clamp-3">
                      {request.justification}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      disabled={approveRequest.isPending}
                      loading={approveRequest.isPending && approveRequest.variables === request.id}
                      size="sm"
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowDeclineModal(true)
                      }}
                      disabled={approveRequest.isPending || declineRequest.isPending}
                      size="sm"
                      className="flex-1"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowInfoModal(true)
                      }}
                      disabled={approveRequest.isPending || requestMoreInfo.isPending}
                      size="sm"
                    >
                      Request Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Decline Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Access</p>
                <p className="font-medium text-foreground">{selectedRequest.accessName}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="decline-reason">Reason for declining</Label>
                <Textarea
                  id="decline-reason"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Provide a reason for declining this request..."
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleDecline}
                  disabled={!declineReason.trim() || declineRequest.isPending}
                  loading={declineRequest.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  Decline
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDeclineModal(false)
                    setSelectedRequest(null)
                    setDeclineReason("")
                  }}
                  disabled={declineRequest.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request More Info Modal */}
      {showInfoModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request More Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Access</p>
                <p className="font-medium text-foreground">{selectedRequest.accessName}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="info-message">Message to requester</Label>
                <Textarea
                  id="info-message"
                  value={infoMessage}
                  onChange={(e) => setInfoMessage(e.target.value)}
                  placeholder="What additional information do you need?"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleRequestMoreInfo}
                  disabled={!infoMessage.trim() || requestMoreInfo.isPending}
                  loading={requestMoreInfo.isPending}
                  className="flex-1"
                >
                  Send
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowInfoModal(false)
                    setSelectedRequest(null)
                    setInfoMessage("")
                  }}
                  disabled={requestMoreInfo.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
