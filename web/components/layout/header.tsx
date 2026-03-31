"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { UserNav } from "./user-nav"
import { NotificationBell } from "@/components/access"
import { NotificationDropdown } from "@/components/access"

// Check if user has admin role
const isAdminUser = (session: { user?: { role?: string } } | null): boolean => {
  return session?.user?.role === "admin"
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navigation?: React.ReactNode
  actions?: React.ReactNode
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, logo, navigation, actions, children, ...props }, ref) => {
    const { status, data: session } = useSession()
    const isAuthenticated = status === "authenticated"
    const isAdmin = isAdminUser(session)
    const [showNotifications, setShowNotifications] = React.useState(false)
    const pathname = usePathname()

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full bg-surface-container-low/95 backdrop-blur-glass border-b border-outline-variant/20",
          className
        )}
        {...props}
      >
        {children || (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-6">
                {logo || (
                  <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-on-primary transition-transform duration-200 group-hover:scale-105">
                      <Shield className="w-6 h-6" />
                    </div>
                    <span className="text-headline-sm font-semibold text-on-surface hidden sm:block">
                      Access Manager
                    </span>
                  </Link>
                )}
                {isAuthenticated && (
                  navigation || (
                    <nav className="flex items-center gap-1 sm:gap-2">
                      <Link
                        href="/access"
                        className={cn(
                          "px-3 py-2 text-body-md font-medium rounded-md transition-all duration-200",
                          pathname === "/access"
                            ? "bg-surface-container text-on-surface"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        )}
                      >
                        Access Catalog
                      </Link>
                      <Link
                        href="/requests"
                        className={cn(
                          "px-3 py-2 text-body-md font-medium rounded-md transition-all duration-200",
                          pathname === "/requests"
                            ? "bg-surface-container text-on-surface"
                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        )}
                      >
                        My Requests
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/approvals"
                          className={cn(
                            "px-3 py-2 text-body-md font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                            pathname.startsWith("/admin")
                              ? "bg-surface-container text-on-surface"
                              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                          )}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approvals</span>
                        </Link>
                      )}
                    </nav>
                  )
                )}
              </div>
              <div className="flex items-center gap-4">
                {isAuthenticated && (
                  <div className="relative">
                    <NotificationBell onClick={() => setShowNotifications(!showNotifications)} />
                    <NotificationDropdown
                      isOpen={showNotifications}
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
                {actions || (isAuthenticated && <UserNav />)}
              </div>
            </div>
          </div>
        )}
      </header>
    )
  }
)

Header.displayName = "Header"

export { Header }
