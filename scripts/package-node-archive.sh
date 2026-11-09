#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ "$(node -p 'process.platform')" != "linux" ]]; then
    echo "Runtime archives must be built on Linux." >&2
    exit 1
fi

NODE_VERSION="24.18.0"
if [[ "$(node --version)" != "v${NODE_VERSION}" ]]; then
    echo "Runtime archives must use Node.js v${NODE_VERSION}; found $(node --version)." >&2
    exit 1
fi

case "$(node -p 'process.arch')" in
    x64) AWS_ARCH="x86_64" ;;
    arm64) AWS_ARCH="arm64" ;;
    *) echo "Unsupported Linux architecture: $(node -p 'process.arch')" >&2; exit 1 ;;
esac

MANIFEST_NODE="$(node -p "JSON.parse(require('fs').readFileSync('${ROOT}/dist/node/build-manifest.json')).node")"
if [[ "${MANIFEST_NODE}" != "v${NODE_VERSION}" ]]; then
    echo "Server distribution was built with Node.js ${MANIFEST_NODE}; expected v${NODE_VERSION}." >&2
    exit 1
fi

STAGING="$(mktemp -d)"
trap 'rm -rf "${STAGING}"' EXIT
cp -a "${ROOT}/dist/node/." "${STAGING}/"
install -m 755 "$(node -p 'process.execPath')" "${STAGING}/node"
printf '{"node":"%s","platform":"linux","arch":"%s"}\n' \
    "$(node --version)" "$(node -p 'process.arch')" > "${STAGING}/node-runtime.json"

"${STAGING}/node" --version
tar -czf "${ROOT}/dist/cocreate-server-node-linux-${AWS_ARCH}.tar.gz" \
    -C "${STAGING}" .
