#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAG="${1:-${GITHUB_REF_NAME:-}}"

if [[ -z "${TAG}" ]]; then
    echo "A GitHub release tag is required (for example: v1.2.3)." >&2
    exit 1
fi

VERSION="$(cd "${ROOT}" && node -p 'require("./package.json").version')"
TAG_VERSION="${TAG#v}"
if [[ "${TAG_VERSION}" != "${VERSION}" ]]; then
    echo "Release tag ${TAG} does not match package version ${VERSION}." >&2
    exit 1
fi

cd "${ROOT}"
if [[ "$(node -p 'process.platform')" != "linux" ]]; then
    echo "Release runtime archives must be built on Linux." >&2
    exit 1
fi
case "$(node -p 'process.arch')" in
    x64) AWS_ARCH="x86_64" ;;
    arm64) AWS_ARCH="arm64" ;;
    *) echo "Unsupported Linux architecture: $(node -p 'process.arch')" >&2; exit 1 ;;
esac
echo "Building @cocreate/server@${VERSION} for Linux ${AWS_ARCH}..."
yarn package:node

SOURCE="${ROOT}/dist/cocreate-server-node-linux-${AWS_ARCH}.tar.gz"
RELEASE_DIR="${ROOT}/dist/releases"
ARCHIVE="cocreate-server-${VERSION}-node-linux-${AWS_ARCH}.tar.gz"
mkdir -p "${RELEASE_DIR}"
cp "${SOURCE}" "${RELEASE_DIR}/${ARCHIVE}"
(
    cd "${RELEASE_DIR}"
    sha256sum "${ARCHIVE}" > "${ARCHIVE}.sha256"
)

echo "${RELEASE_DIR}/${ARCHIVE}"
echo "${RELEASE_DIR}/${ARCHIVE}.sha256"
