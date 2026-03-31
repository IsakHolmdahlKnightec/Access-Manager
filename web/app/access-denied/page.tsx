"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldX } from "lucide-react"

export default function AccessDeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-error/10 text-error">
            <ShieldX className="w-10 h-10" />
          </div>
        </div>
        
        <h1 className="text-headline-lg font-semibold text-on-surface mb-3">
          Access Denied
        </h1>
        
        <p className="text-body-lg text-on-surface-variant mb-8">
          You don&apos;t have permission to access this page. This area is 
          restricted to administrators only.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/access"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-on-primary font-medium transition-colors hover:bg-primary/90"
          >
            Go to Access Catalog
          </Link>
          <Link
            href="/requests"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-surface-container text-on-surface font-medium transition-colors hover:bg-surface-container/80 border border-outline"
          >
            View My Requests
          </Link>
        </div>
      </div>
    </div>
  )
}
