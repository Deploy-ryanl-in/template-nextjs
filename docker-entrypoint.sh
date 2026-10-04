#!/bin/sh
set -eu
mkdir -p /tmp/next-image-cache /tmp/paas-next-cache
exec node server.js
