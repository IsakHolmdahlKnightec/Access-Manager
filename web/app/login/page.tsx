"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Shield, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Handle error from URL
  useEffect(() => {
    if (error) {
      if (error === "CredentialsSignin") {
        setErrorMessage("Invalid email or password")
      } else if (error === "SessionRequired") {
        setErrorMessage("Please sign in to access this page")
      } else if (error === "OAuthSignin" || error === "OAuthCallback") {
        setErrorMessage("Authentication failed. Please try again.")
      } else {
        setErrorMessage("An error occurred. Please try again.")
      }
    }
  }, [error])

  const handleSignIn = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await signIn("cognito", {
        callbackUrl,
        redirect: true,
      })
    } catch {
      setErrorMessage("Unable to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6 py-12">
      <main className="w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-primary text-on-primary p-3 rounded-lg mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-display-sm font-bold tracking-tight text-primary">
            ACCESS MANAGER
          </h1>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-headline-lg font-bold tracking-tight text-primary mb-3">
              Welcome back
            </h2>
            <p className="text-on-surface-variant font-medium">
              Sign in to access your workspace.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Sign In Button */}
          <div className="pt-2">
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={cn(
                "w-full h-12 bg-primary text-on-primary font-bold text-sm tracking-wide rounded-lg",
                "hover:bg-primary-container hover:text-on-primary-container",
                "active:scale-[0.98] transition-all",
                "flex items-center justify-center gap-2 shadow-sm",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In with SSO
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-body-sm text-on-surface-variant">
              Use your company credentials to sign in.
            </p>
          </div>

          {/* Footer */}
          <footer className="pt-8 text-center border-t border-outline-variant/30">
            <p className="text-on-surface-variant text-[10px] font-bold tracking-widest mb-4 uppercase">
              Secured by Enterprise Encryption
            </p>
            <div className="flex justify-center gap-6 text-xs font-semibold text-outline">
              <a href="#" className="hover:text-primary transition-colors">
                Legal
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Security
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse">
          <Shield className="w-12 h-12 text-primary/50" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
