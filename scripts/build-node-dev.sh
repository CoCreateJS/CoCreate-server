#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="dev"
DATE="${DEV_RELEASE_DATE:-$(TZ=America/Guatemala date +%F)}"
RELEASE_DIR="${ROOT}/dist/releases/${DATE}"

if [[ ! "${DATE}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    echo "Invalid development release date: ${DATE}" >&2
    exit 1
fi
if [[ "$(node -p 'process.platform')" != "linux" ]]; then
    echo "Development runtime archives must be built on Linux." >&2
    exit 1
fi

case "$(node -p 'process.arch')" in
    x64) AWS_ARCH="x86_64" ;;
    arm64) AWS_ARCH="arm64" ;;
    *) echo "Unsupported Linux architecture: $(node -p 'process.arch')" >&2; exit 1 ;;
esac
ARCHIVE="cocreate-server-node-linux-${AWS_ARCH}.tar.gz"

cd "${ROOT}"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "${GITHUB_ACTIONS:-}" == "true" && "${GITHUB_REF_NAME:-}" == "${BRANCH}" ]]; then
    CURRENT_BRANCH="${GITHUB_REF_NAME}"
fi
if [[ "${CURRENT_BRANCH}" != "${BRANCH}" ]]; then
    echo "Development builds must be created from the ${BRANCH} branch (current: ${CURRENT_BRANCH:-detached HEAD})." >&2
    exit 1
fi

echo "Packaging the Linux ${AWS_ARCH} Node runtime with committed, verified storage and plugin distributions..."
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
Linux ${AWS_ARCH} Node.js runtime bundle for development on AWS.

Includes the packaged CoCreate Server, storage providers, and AI runtime.
${SOURCE_STATE}
CoCreate Server base commit: ${SOURCE_COMMIT}.
The SHA-256 checksum is attached as ${ARCHIVE}.sha256.
EOF

printf '%s\n' "${DATE}" > "${ROOT}/dist/releases/.dev-release-current"
echo "Build staged in dist/releases/${DATE}. Run 'yarn release:dev' to upload it."
