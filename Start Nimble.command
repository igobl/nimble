#!/bin/bash

cd "$(dirname "$0")"

echo "Starting Nimble..."
echo ""

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Nimble needs Node.js to run, and it does not look like it is installed."
  echo ""
  echo "1. Open https://nodejs.org"
  echo "2. Download the LTS version and install it"
  echo "3. Double-click this file again"
  echo ""
  if command -v open >/dev/null 2>&1; then
    open "https://nodejs.org"
  fi
  read -r -p "Press Enter to close this window..."
  exit 1
fi

echo "Installing (this can take a few minutes the first time)..."
echo ""
if ! npm install; then
  echo ""
  echo "Something went wrong while installing. Leave this window open and send a screenshot to whoever shared Nimble with you."
  read -r -p "Press Enter to close this window..."
  exit 1
fi

echo ""
echo "Launching Nimble. A browser window should open at http://localhost:3000"
echo "Leave this window open while you use the app. Close it when you are finished."
echo ""

npm start

echo ""
read -r -p "Press Enter to close this window..."
