"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useRequest, useCancelRequest, useAddMoreInfo } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  RequestStatusBadge,
  LoadingSpinner,
} from "@/components/access"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RequestDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string

  const { data, isLoading, error } = useRequest(requestId)
  const cancelRequest = useCancelRequest()
  const addMoreInfo = useAddMoreInfo()

  const [showMoreInfoForm, setShowMoreInfoForm] = React.useState(false)
  const [moreInfoMessage, setMoreInfoMessage] = React.useState("")

  const request = data?.request

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const handleCancel = async () => {
    if (!request || request.status !== "pending") return

    const confirmed = window.confirm("Are you sure you want to cancel this request?")
    if (!confirmed) return

    try {
      await cancelRequest.mutateAsync(request.id)
      router.push("/requests")
    } catch {
      alert("Failed to cancel request. Please try again.")
    }
  }

  const handleSubmitMoreInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!request || !moreInfoMessage.trim()) return

    try {
      await addMoreInfo.mutateAsync({
        requestId: request.id,
        input: { message: moreInfoMessage.trim() },
      })
      setShowMoreInfoForm(false)
      setMoreInfoMessage("")
    } catch {
      alert("Failed to submit more info. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-body-md text-error">Request not found</p>
        <Button variant="ghost" onClick={() => router.push("/requests")} className="mt-4">
          Back to My Requests
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-surface-container-low py-8 px-6">
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" onClick={() => router.push("/requests")} className="mb-4">
            ← Back to My Requests
          </Button>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-headline-md font-semibold text-foreground">
                Request Details
              </h1>
              <p className="mt-1 text-body-sm text-muted-foreground">
                Request ID: {request.id}
              </p>
            </div>
            <RequestStatusBadge status={request.status} className="ml-auto" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Request Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Access Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Access</p>
                <p className="font-medium text-foreground">{request.accessName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium text-foreground capitalize">
                  {request.accessType.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground capitalize">
                  {request.duration.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium text-foreground">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Justification Card */}
        <Card>
          <CardHeader>
            <CardTitle>Justification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-md text-foreground whitespace-pre-wrap">
              {request.justification}
            </p>
          </CardContent>
        </Card>

        {/* Resolution Info (if resolved) */}
        {request.resolvedAt && (
          <Card className={cn(
            request.status === "approved" && "border-success/50",
            request.status === "declined" && "border-error/50"
          )}>
            <CardHeader>
              <CardTitle>
                {request.status === "approved" && "Approved"}
                {request.status === "declined" && "Declined"}
                {request.status === "more_info" && "More Information Requested"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.resolutionNote && (
                <div>
                  <p className="text-sm text-muted-foreground">Note</p>
                  <p className="text-body-md text-foreground">{request.resolutionNote}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Resolved On</p>
                <p className="text-body-md text-foreground">{formatDate(request.resolvedAt)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* More Info Request Message */}
        {request.requestedMoreInfoMessage && request.status === "more_info" && (
          <Card className="border-warning/50">
            <CardHeader>
              <CardTitle>Additional Information Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-md text-foreground whitespace-pre-wrap">
                {request.requestedMoreInfoMessage}
              </p>
            </CardContent>
          </Card>
        )}

        {/* More Info Form (for more_info status) */}
        {request.status === "more_info" && !showMoreInfoForm && (
          <Card>
            <CardContent className="pt-6">
              <Button onClick={() => setShowMoreInfoForm(true)}>
                Provide More Information
              </Button>
            </CardContent>
          </Card>
        )}

        {showMoreInfoForm && (
          <Card>
            <CardHeader>
              <CardTitle>Provide More Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitMoreInfo} className="space-y-4">
                <Textarea
                  value={moreInfoMessage}
                  onChange={(e) => setMoreInfoMessage(e.target.value)}
                  placeholder="Explain how you will use this access..."
                  rows={5}
                />
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!moreInfoMessage.trim() || addMoreInfo.isPending}
                    loading={addMoreInfo.isPending}
                    loadingText="Submitting..."
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowMoreInfoForm(false)}
                    disabled={addMoreInfo.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {request.status === "pending" && (
          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelRequest.isPending}
              loading={cancelRequest.isPending}
              loadingText="Cancelling..."
            >
              Cancel Request
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
