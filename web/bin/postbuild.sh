#!/usr/bin/env bash
set -euo pipefail

# Amplify Hosting Post-Build Script
# Generates the .amplify-hosting directory with deploy-manifest.json

NEXT_VERSION=$(node -p "require('next/package.json').version")

# Create the .amplify-hosting directory structure
mkdir -p ./.amplify-hosting/compute/default

# The standalone output may have a nested structure, flatten it
if [ -d "./.next/standalone/web" ]; then
  # Next.js creates nested web/ directory - flatten it
  cp -r ./.next/standalone/web/* ./.amplify-hosting/compute/default/
else
  cp -r ./.next/standalone/* ./.amplify-hosting/compute/default/
fi

# Copy static assets if they exist
if [ -d "./.next/static" ]; then
  mkdir -p ./.amplify-hosting/compute/default/.next
  cp -r ./.next/static ./.amplify-hosting/compute/default/.next/
fi

# Create the deploy-manifest.json
cat > ./.amplify-hosting/deploy-manifest.json << EOF
{
  "version": 1,
  "framework": { "name": "nextjs", "version": "${NEXT_VERSION}" },
  "imageSettings": {
    "images": {
      "domains": [],
      "remotePatterns": []
    }
  },
  "routes": [
    {
      "path": "/.*",
      "target": {
        "kind": "EXEC",
        "src": "compute/default"
      }
    }
  ],
  "computeResources": [
    {
      "kind": "AWS_LAMBDA",
      "memory": 512,
      "timeout": 10
    }
  ]
}
EOF

echo "Amplify hosting artifacts generated successfully."
