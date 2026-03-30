#!/usr/bin/env bash
set -euo pipefail

echo "Starting Amplify hosting post-build script..."

# Amplify Hosting Post-Build Script
# Generates the .amplify-hosting directory with deploy-manifest.json

NEXT_VERSION=$(node -p "require('next/package.json').version")
echo "Next.js version: ${NEXT_VERSION}"

# Create the .amplify-hosting directory structure
mkdir -p ./.amplify-hosting/compute/default

echo "Copying standalone build files..."

# The standalone output may have a nested structure, flatten it
if [ -d "./.next/standalone/web" ]; then
  # Next.js creates nested web/ directory - flatten it
  cp -r ./.next/standalone/web/* ./.amplify-hosting/compute/default/
  echo "Copied from .next/standalone/web/"
elif [ -d "./.next/standalone" ]; then
  cp -r ./.next/standalone/* ./.amplify-hosting/compute/default/
  echo "Copied from .next/standalone/"
else
  echo "ERROR: .next/standalone directory not found!"
  exit 1
fi

# Create static directory for Amplify Hosting
mkdir -p ./.amplify-hosting/static

# Copy static assets to the static directory for optimal serving
if [ -d "./.next/static" ]; then
  echo "Copying static assets..."
  mkdir -p ./.amplify-hosting/static/_next
  cp -r ./.next/static ./.amplify-hosting/static/_next/
  
  # Also copy to compute for fallback
  mkdir -p ./.amplify-hosting/compute/default/.next
  cp -r ./.next/static ./.amplify-hosting/compute/default/.next/
fi

# Copy public folder if it exists (Next.js standalone doesn't copy it automatically)
if [ -d "./public" ]; then
  echo "Copying public folder..."
  cp -r ./public/* ./.amplify-hosting/static/ 2>/dev/null || true
  cp -r ./public/* ./.amplify-hosting/compute/default/ 2>/dev/null || true
fi

# Verify server.js exists
if [ ! -f "./.amplify-hosting/compute/default/server.js" ]; then
  echo "ERROR: server.js not found in compute/default!"
  echo "Contents of compute/default:"
  ls -la ./.amplify-hosting/compute/default/ || echo "Directory is empty or doesn't exist"
  exit 1
fi

echo "Creating deploy-manifest.json..."

# Create the deploy-manifest.json with correct format for WEB_COMPUTE
cat > ./.amplify-hosting/deploy-manifest.json << EOF
{
  "version": 1,
  "framework": { 
    "name": "nextjs", 
    "version": "${NEXT_VERSION}" 
  },
  "imageSettings": {
    "sizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    "domains": [],
    "remotePatterns": [],
    "formats": ["image/webp"],
    "minimumCacheTTL": 60,
    "dangerouslyAllowSVG": false
  },
  "routes": [
    {
      "path": "/_next/static/*",
      "target": {
        "kind": "Static",
        "cacheControl": "public, max-age=31536000, immutable"
      }
    },
    {
      "path": "/static/*",
      "target": {
        "kind": "Static",
        "cacheControl": "public, max-age=31536000, immutable"
      }
    },
    {
      "path": "/*.*",
      "target": {
        "kind": "Static",
        "cacheControl": "public, max-age=3600"
      },
      "fallback": {
        "kind": "Compute",
        "src": "default"
      }
    },
    {
      "path": "/*",
      "target": {
        "kind": "Compute",
        "src": "default"
      }
    }
  ],
  "computeResources": [
    {
      "name": "default",
      "runtime": "nodejs20.x",
      "entrypoint": "server.js"
    }
  ]
}
EOF

echo "Verifying deploy-manifest.json was created..."
if [ ! -f "./.amplify-hosting/deploy-manifest.json" ]; then
  echo "ERROR: deploy-manifest.json was not created!"
  exit 1
fi

echo "Contents of .amplify-hosting:"
ls -la ./.amplify-hosting/

echo "Amplify hosting artifacts generated successfully!"
