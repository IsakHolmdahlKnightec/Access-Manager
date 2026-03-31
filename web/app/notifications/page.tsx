"use client"

import * as React from "react"
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/api"
import type { Notification } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { EmptyState, EmptyStatePresets, LoadingSpinner } from "@/components/access"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.notifications ?? []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markRead.mutateAsync(notification.id)
    }

    // Navigate to related request if available
    if (notification.requestId) {
      window.location.href = `/requests/${notification.requestId}`
    }
  }

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync()
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "request_submitted":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-container">
            <svg className="h-5 w-5 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          </div>
        )
      case "request_approved":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-container">
            <svg className="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
        )
      case "request_declined":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-container">
            <svg className="h-5 w-5 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )
      case "request_more_info":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-container">
            <svg className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        )
      case "new_pending_request":
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
            <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
            <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-surface-container-low py-8 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-headline-md font-semibold text-foreground">
                Notifications
              </h1>
              <p className="mt-2 text-body-md text-muted-foreground">
                Stay updated on your access requests
              </p>
            </div>
            {notifications.some((n) => !n.isRead) && (
              <Button
                variant="ghost"
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-body-md text-error">Failed to load notifications</p>
            <p className="mt-1 text-sm text-muted-foreground">Please try again later</p>
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState {...EmptyStatePresets.noNotifications} />
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "w-full rounded-lg p-4 text-left transition-colors",
                  notification.isRead
                    ? "bg-surface-container-low hover:bg-surface-container"
                    : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <div className="flex items-start gap-4">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "font-medium",
                        notification.isRead ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    {notification.accessName && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Access: {notification.accessName}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
