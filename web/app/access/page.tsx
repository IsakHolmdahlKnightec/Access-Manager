"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAccesses } from "@/lib/api"
import type { AccessType } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { AccessCard, EmptyState, EmptyStatePresets, SkeletonCard } from "@/components/access"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Access type filter tabs
const ACCESS_TYPE_TABS: { label: string; value: AccessType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "AWS", value: "aws" },
  { label: "Web Service", value: "web_service" },
  { label: "Database", value: "database" },
]

const PAGE_SIZE = 25

export default function AccessCatalogPage() {
  const router = useRouter()

  // Filter state
  const [selectedType, setSelectedType] = React.useState<AccessType | "all">("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [page, setPage] = React.useState(1)

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1) // Reset to first page when search changes
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch accesses
  const { data, isLoading, error } = useAccesses({
    type: selectedType === "all" ? undefined : selectedType,
    search: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const accesses = data?.accesses ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

  const handleRequestAccess = (accessId: string) => {
    router.push(`/requests/new?accessId=${accessId}`)
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-surface-container-low py-8 px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-headline-md font-semibold text-foreground">
            Access Catalog
          </h1>
          <p className="mt-2 text-body-md text-muted-foreground">
            Browse and request access to available systems and resources
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Filters and Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Type Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {ACCESS_TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setSelectedType(tab.value)
                  setPage(1)
                }}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  selectedType === tab.value
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-foreground hover:bg-surface-container-high"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <Input
              type="search"
              placeholder="Search accesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-body-md text-error">Failed to load accesses</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : accesses.length === 0 ? (
            // Empty state
            debouncedSearch || selectedType !== "all" ? (
              <EmptyState {...EmptyStatePresets.searchNoResults} />
            ) : (
              <EmptyState {...EmptyStatePresets.noAccesses} />
            )
          ) : (
            <>
              {/* Access Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {accesses.map((access) => (
                  <AccessCard
                    key={access.id}
                    access={access}
                    onRequestAccess={handleRequestAccess}
                  />
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
    </div>
  )
}
