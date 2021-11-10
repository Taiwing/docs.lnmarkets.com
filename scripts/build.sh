#!/usr/bin/env bash

set -o errexit

pnpm redoc-cli bundle --output ./build/index.html --title "LN Markets Api Reference" spec.json
