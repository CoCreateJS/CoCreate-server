#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ "$(node -p 'process.platform')" != "linux" ]]; then
    echo "Runtime archives must be built on Linux." >&2
    exit 1
fi

case "$(node -p 'process.arch')" in
    x64) AWS_ARCH="x86_64" ;;
    arm64) AWS_ARCH="arm64" ;;
    *) echo "Unsupported Linux architecture: $(node -p 'process.arch')" >&2; exit 1 ;;
esac

tar -czf "${ROOT}/dist/cocreate-server-node-linux-${AWS_ARCH}.tar.gz" \
    -C "${ROOT}/dist/node" .
