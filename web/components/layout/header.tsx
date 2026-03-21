import * as React from "react"
import Link from "next/link";
import { Shield } from "lucide-react";

import { cn } from "@/lib/utils"

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navigation?: React.ReactNode
  actions?: React.ReactNode
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, logo, navigation, actions, children, ...props }, ref) => (
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
              {navigation || (
                <nav className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/"
                    className="px-3 py-2 text-body-md font-medium text-on-surface-variant rounded-md transition-all duration-200 hover:bg-surface-container hover:text-on-surface"
                  >
                    Home
                  </Link>
                  <Link
                    href="#features"
                    className="px-3 py-2 text-body-md font-medium text-on-surface-variant rounded-md transition-all duration-200 hover:bg-surface-container hover:text-on-surface"
                  >
                    Features
                  </Link>
                </nav>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
)

Header.displayName = "Header"

export { Header }
