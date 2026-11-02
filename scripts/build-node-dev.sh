#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="dev"
DATE="$(TZ=America/Guatemala date +%F)"
ARCHIVE="cocreatews-node-linux-x64.tar.gz"
RELEASE_DIR="${ROOT}/dist/releases/${DATE}"

cd "${ROOT}"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "${GITHUB_ACTIONS:-}" == "true" && "${GITHUB_REF_NAME:-}" == "${BRANCH}" ]]; then
    CURRENT_BRANCH="${GITHUB_REF_NAME}"
fi
if [[ "${CURRENT_BRANCH}" != "${BRANCH}" ]]; then
    echo "Development builds must be created from the ${BRANCH} branch (current: ${CURRENT_BRANCH:-detached HEAD})." >&2
    exit 1
fi

echo "Packaging the Linux x64 Node runtime with committed, verified storage and plugin distributions..."
yarn package:node

mkdir -p "${RELEASE_DIR}"
cp "${ROOT}/dist/${ARCHIVE}" "${RELEASE_DIR}/${ARCHIVE}"
(
    cd "${RELEASE_DIR}"
    sha256sum "${ARCHIVE}" > "${ARCHIVE}.sha256"
)

SOURCE_COMMIT="$(node --input-type=module -e 'import manifest from "./dist/node/build-manifest.json" with { type: "json" }; console.log(manifest.commit)')"
if [[ -n "$(git status --porcelain)" ]]; then
    SOURCE_STATE="Built from the CoCreate Server working tree, including local changes and runtime assets."
else
    SOURCE_STATE="Built from committed CoCreate Server source and committed runtime assets."
fi
cat > "${RELEASE_DIR}/RELEASE-NOTES.txt" <<EOF
Linux x64 Node.js runtime bundle for development.

Includes the packaged CoCreate Server, storage providers, and AI runtime.
${SOURCE_STATE}
CoCreate Server base commit: ${SOURCE_COMMIT}.
The SHA-256 checksum is attached as ${ARCHIVE}.sha256.
EOF

printf '%s\n' "${DATE}" > "${ROOT}/dist/releases/.dev-release-current"
echo "Build staged in dist/releases/${DATE}. Run 'yarn release:dev' to upload it."
