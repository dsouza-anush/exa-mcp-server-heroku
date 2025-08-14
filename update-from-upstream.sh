#!/bin/bash

# Script to update from the original exa-mcp-server repository
# while preserving the Heroku deployment customizations

set -e

# Ensure we're in the right directory
cd "$(dirname "$0")"

echo "Updating from upstream repository..."

# Add the upstream repository if it doesn't exist
if ! git remote | grep -q "upstream"; then
  echo "Adding upstream remote..."
  git remote add upstream https://github.com/exa-labs/exa-mcp-server.git
fi

# Get the current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Fetch the latest changes from upstream
echo "Fetching latest changes from upstream..."
git fetch upstream

# Save current Heroku customizations
echo "Saving current Heroku customizations..."
mkdir -p .temp
cp -f app.json .temp/ 2>/dev/null || true
cp -f Procfile .temp/ 2>/dev/null || true
git diff upstream/main -- src/index.ts > .temp/index.ts.patch 2>/dev/null || true
git diff upstream/main -- package.json > .temp/package.json.patch 2>/dev/null || true
git diff upstream/main -- README.md > .temp/readme.patch 2>/dev/null || true

# Merge upstream changes
echo "Merging upstream changes..."
git merge upstream/main -m "Merge upstream changes" || {
  echo "Merge conflict occurred. Aborting merge."
  git merge --abort
  echo "Please resolve conflicts manually and try again."
  exit 1
}

# Restore Heroku customizations
echo "Restoring Heroku customizations..."
[ -f .temp/app.json ] && cp -f .temp/app.json ./ || true
[ -f .temp/Procfile ] && cp -f .temp/Procfile ./ || true
[ -f .temp/index.ts.patch ] && git apply .temp/index.ts.patch 2>/dev/null || true
[ -f .temp/package.json.patch ] && git apply .temp/package.json.patch 2>/dev/null || true
[ -f .temp/readme.patch ] && git apply .temp/readme.patch 2>/dev/null || true

# Clean up
rm -rf .temp

echo "Update completed. Please review changes and commit if everything looks good."
echo "To commit the changes, run: git commit -am 'Updated from upstream with Heroku customizations'"