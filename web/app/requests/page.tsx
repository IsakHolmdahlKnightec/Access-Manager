"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRequests, useCancelRequest } from "@/lib/api"
import type { AccessRequest } from "@/lib/api/types"
import { RequestStatusBadge, EmptyState, EmptyStatePresets, SkeletonListItem } from "@/components/access"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 20

export default function MyRequestsPage() {
  const router = useRouter()
  const [page, setPage] = React.useState(1)

  const { data, isLoading, error } = useRequests({ page, pageSize: PAGE_SIZE })
  const cancelRequest = useCancelRequest()

  const requests = data?.requests ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

  const handleCancel = async (request: AccessRequest) => {
    if (request.status !== "pending") return

    const confirmed = window.confirm("Are you sure you want to cancel this request?")
    if (!confirmed) return

    try {
      await cancelRequest.mutateAsync(request.id)
    } catch {
      alert("Failed to cancel request. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-surface-container-low py-8 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-headline-md font-semibold text-foreground">
                My Requests
              </h1>
              <p className="mt-2 text-body-md text-muted-foreground">
                Track the status of your access requests
              </p>
            </div>
            <Button onClick={() => router.push("/access")}>
              Request Access
            </Button>
          </div>
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
            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later
            </p>
          </div>
        ) : requests.length === 0 ? (
          // Empty state
          <EmptyState {...EmptyStatePresets.noRequests} />
        ) : (
          <>
            {/* Request List */}
            <div className="space-y-3">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  href={`/requests/${request.id}`}
                  className="block rounded-lg bg-surface-container-low p-4 transition-all hover:bg-surface-container"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-foreground truncate">
                          {request.accessName}
                        </p>
                        <RequestStatusBadge status={request.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {request.justification}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Requested {formatDate(request.createdAt)}</span>
                        <span className="uppercase">{request.duration.replace("_", " ")}</span>
                      </div>
                    </div>

                    {/* Cancel button for pending requests */}
                    {request.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleCancel(request)
                        }}
                        className="text-error hover:text-error hover:bg-error-container"
                        disabled={cancelRequest.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <span className="px-4 text-body-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
