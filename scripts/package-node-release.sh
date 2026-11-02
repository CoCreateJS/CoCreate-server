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
echo "Building @cocreate/server@${VERSION} for Linux x64..."
yarn package:node

SOURCE="${ROOT}/dist/cocreatews-node-linux-x64.tar.gz"
RELEASE_DIR="${ROOT}/dist/releases"
ARCHIVE="cocreate-server-${VERSION}-node-linux-x64.tar.gz"
mkdir -p "${RELEASE_DIR}"
cp "${SOURCE}" "${RELEASE_DIR}/${ARCHIVE}"
(
    cd "${RELEASE_DIR}"
    sha256sum "${ARCHIVE}" > "${ARCHIVE}.sha256"
)

echo "${RELEASE_DIR}/${ARCHIVE}"
echo "${RELEASE_DIR}/${ARCHIVE}.sha256"
