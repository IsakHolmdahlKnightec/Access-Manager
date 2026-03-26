import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"
import type { NextAuthConfig, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
    accessToken?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    idToken?: string
    accessTokenExpires?: number
    user?: {
      id: string
      email: string
      name?: string | null
    }
    error?: string
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `https://${process.env.COGNITO_DOMAIN}/oauth2/token`
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
        client_id: process.env.COGNITO_APP_CLIENT_ID!,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Cognito({
      clientId: process.env.COGNITO_APP_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: `https://${process.env.COGNITO_DOMAIN}`,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          accessTokenExpires: account.expires_at! * 1000,
          user: {
            id: user.id || "",
            email: user.email || "",
            name: user.name,
          },
        }
      }

      // Return previous token if the access token has not expired
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user = {
          ...session.user,
          id: token.user?.id ?? "",
          email: token.user?.email ?? "",
          name: token.user?.name,
        }
        session.accessToken = token.accessToken
        session.error = token.error
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
