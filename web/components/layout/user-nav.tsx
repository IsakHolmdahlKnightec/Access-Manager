"use client"

import * as React from "react"
import { User, Settings, LogOut, ChevronDown, Shield } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

// Check if user has admin role
const isAdminUser = (session: { user?: { role?: string } } | null): boolean => {
  return session?.user?.role === "admin"
}

export interface UserNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onProfile?: () => void
  onSettings?: () => void
}

const UserNav = React.forwardRef<HTMLDivElement, UserNavProps>(
  ({ className, onProfile, onSettings, ...props }, ref) => {
    const { data: session, status } = useSession()
    const user = session?.user
    const isAdmin = isAdminUser(session)

    const handleLogout = async () => {
      await signOut({ callbackUrl: "/login" })
    }

    const handleValueChange = (value: string | null) => {
      if (!value) return
      switch (value) {
        case "profile":
          onProfile?.()
          break
        case "settings":
          onSettings?.()
          break
        case "logout":
          handleLogout()
          break
      }
    }

    // Get user initials
    const getInitials = (name: string | null | undefined) => {
      if (!name) return "U"
      return name.charAt(0).toUpperCase()
    }

    if (status === "loading") {
      return (
        <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
          <div className="h-8 w-8 rounded-full bg-surface-container animate-pulse" />
          <div className="hidden md:block space-y-1">
            <div className="h-4 w-20 bg-surface-container rounded animate-pulse" />
            <div className="h-3 w-24 bg-surface-container rounded animate-pulse" />
          </div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <Select value="" onValueChange={handleValueChange}>
          <SelectTrigger className="w-auto border-0 bg-transparent hover:bg-surface-container gap-2 px-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-medium">
                {getInitials(user.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  {user.name || user.email}
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-xs text-on-surface-variant">{user.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-on-surface-variant" />
            </div>
          </SelectTrigger>
          <SelectContent className="w-48">
            <SelectItem value="profile">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
            </SelectItem>
            <SelectItem value="settings">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </div>
            </SelectItem>
            <SelectItem value="logout">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }
)

UserNav.displayName = "UserNav"

export { UserNav }