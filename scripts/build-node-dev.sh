#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="dev"
DATE="$(TZ=America/Guatemala date +%F)"
ARCHIVE="cocreatews-node-linux-x64.tar.gz"
RELEASE_DIR="${ROOT}/dist/releases/${DATE}"

cd "${ROOT}"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "${CURRENT_BRANCH}" != "${BRANCH}" ]]; then
    echo "Development builds must be created from the ${BRANCH} branch (current: ${CURRENT_BRANCH:-detached HEAD})." >&2
    exit 1
fi

echo "Building and verifying the Linux x64 Node runtime bundle from the linked workspace..."
yarn package:node

mkdir -p "${RELEASE_DIR}"
cp "${ROOT}/dist/${ARCHIVE}" "${RELEASE_DIR}/${ARCHIVE}"
(
    cd "${RELEASE_DIR}"
    sha256sum "${ARCHIVE}" > "${ARCHIVE}.sha256"
)

SOURCE_COMMIT="$(node --input-type=module -e 'import manifest from "./dist/node/build-manifest.json" with { type: "json" }; console.log(manifest.commit)')"
cat > "${RELEASE_DIR}/RELEASE-NOTES.txt" <<EOF
Linux x64 Node.js runtime bundle for development.

Includes the packaged CoCreateWS server, storage providers, and AI runtime.
Built locally from the linked development workspace (CoCreateWS base commit ${SOURCE_COMMIT}).
The bundle includes local working tree changes that may not be in that commit.
The SHA-256 checksum is attached as ${ARCHIVE}.sha256.
EOF

printf '%s\n' "${DATE}" > "${ROOT}/dist/releases/.dev-release-current"
echo "Build staged in dist/releases/${DATE}. Run 'yarn release:dev' to upload it."
