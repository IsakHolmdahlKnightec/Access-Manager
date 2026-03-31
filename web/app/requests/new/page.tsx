"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAccess, useCreateRequest } from "@/lib/api"
import type { RequestDuration } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/access"

const DURATION_OPTIONS: { value: RequestDuration; label: string; description: string }[] = [
  { value: "30_days", label: "30 Days", description: "Temporary access for one month" },
  { value: "90_days", label: "90 Days", description: "Extended access for a quarter" },
  { value: "permanent", label: "Permanent", description: "Ongoing access until revoked" },
]

const MIN_JUSTIFICATION_LENGTH = 10

export default function NewRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedAccessId = searchParams.get("accessId")

  // Fetch pre-selected access if provided
  const { data: accessData, isLoading: isLoadingAccess } = useAccess(preSelectedAccessId)

  // Form state
  const [selectedAccessId] = React.useState<string | null>(preSelectedAccessId)
  const [justification, setJustification] = React.useState("")
  const [duration, setDuration] = React.useState<RequestDuration>("30_days")
  const [error, setError] = React.useState<string | null>(null)

  // Create request mutation
  const createRequest = useCreateRequest()

  // Validation
  const justificationLength = justification.trim().length
  const isValid = selectedAccessId && justificationLength >= MIN_JUSTIFICATION_LENGTH

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid || !selectedAccessId) return

    setError(null)

    try {
      const result = await createRequest.mutateAsync({
        accessId: selectedAccessId,
        justification: justification.trim(),
        duration,
      })

      // Redirect to request details on success
      router.push(`/requests/${result.request.id}`)
    } catch {
      setError("Failed to create request. Please try again.")
    }
  }

  if (isLoadingAccess && preSelectedAccessId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-surface-container-low py-8 px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-headline-md font-semibold text-foreground">
            Request Access
          </h1>
          <p className="mt-2 text-body-md text-muted-foreground">
            Submit a request to gain access to a system or resource
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selected Access Display */}
          {accessData?.access && (
            <div className="rounded-lg bg-surface-container-low p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">{accessData.access.name}</p>
                  <p className="text-sm text-muted-foreground">{accessData.access.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification">
              Justification <span className="text-error">*</span>
            </Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why you need this access and how it will be used..."
              rows={5}
              className={cn(
                justificationLength > 0 && justificationLength < MIN_JUSTIFICATION_LENGTH &&
                "border-warning"
              )}
            />
            <div className="flex items-center justify-between">
              <p className={cn(
                "text-xs",
                justificationLength < MIN_JUSTIFICATION_LENGTH
                  ? "text-muted-foreground"
                  : "text-success"
              )}>
                {justificationLength < MIN_JUSTIFICATION_LENGTH
                  ? `${MIN_JUSTIFICATION_LENGTH - justificationLength} more characters required`
                  : "Minimum length met"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {justificationLength} / 500 characters
              </p>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <Label>Duration</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDuration(option.value)}
                  className={cn(
                    "rounded-lg border-2 p-4 text-left transition-all",
                    duration === option.value
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-primary/50"
                  )}
                >
                  <p className="font-medium text-foreground">{option.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-error-container p-4">
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={!isValid || createRequest.isPending}
              loading={createRequest.isPending}
              loadingText="Submitting..."
              className="flex-1"
            >
              Submit Request
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={createRequest.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
