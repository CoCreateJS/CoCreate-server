#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPOSITORY="CoCreateJS/CoCreate-server"
BRANCH="dev"
RELEASES_DIR="${ROOT}/dist/releases"
DATE_FILE="${RELEASES_DIR}/.dev-release-current"

if [[ -z "${DEV_RELEASE_DATE:-}" && ! -s "${DATE_FILE}" ]]; then
    echo "No staged development build found. Run 'yarn build:dev' first." >&2
    exit 1
fi

DATE="${DEV_RELEASE_DATE:-$(cat "${DATE_FILE}")}"
if [[ ! "${DATE}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    echo "Invalid staged release date: ${DATE}" >&2
    exit 1
fi

TAG="dev-${DATE}"
CHANNEL_TAG="dev-latest"
RELEASE_DIR="${RELEASES_DIR}/${DATE}"
NOTES_PATH="${RELEASE_DIR}/RELEASE-NOTES.txt"
ASSETS=()

for AWS_ARCH in x86_64 arm64; do
    ARCHIVE="cocreate-server-node-linux-${AWS_ARCH}.tar.gz"
    ARCHIVE_PATH="${RELEASE_DIR}/${ARCHIVE}"
    SHA_PATH="${ARCHIVE_PATH}.sha256"
    for file in "${ARCHIVE_PATH}" "${SHA_PATH}"; do
        if [[ ! -s "${file}" ]]; then
            echo "Missing staged development asset: ${file}. Build both Linux architectures first." >&2
            exit 1
        fi
    done
    (cd "${RELEASE_DIR}" && sha256sum --check "${ARCHIVE}.sha256")
    ASSETS+=("${ARCHIVE_PATH}" "${SHA_PATH}")
done

cat > "${NOTES_PATH}" <<EOF
Linux Node.js runtime bundles for AWS EC2.

Assets are provided for x86_64 (Intel or AMD) and arm64 (AWS Graviton).
The x86_64 asset is for 64-bit x86 systems; it is not a 32-bit x86 build.
EOF

if [[ ! -s "${NOTES_PATH}" ]]; then
    echo "Could not create release notes: ${NOTES_PATH}" >&2
    exit 1
fi
gh auth status --hostname github.com

publish_release() {
    local tag="$1"
    local title="$2"

    if gh release view "${tag}" --repo "${REPOSITORY}" >/dev/null 2>&1; then
        gh release upload "${tag}" "${ASSETS[@]}" \
            --repo "${REPOSITORY}" --clobber
        gh release edit "${tag}" --repo "${REPOSITORY}" \
            --title "${title}" \
            --notes-file "${NOTES_PATH}" --prerelease
    else
        gh release create "${tag}" \
            "${ASSETS[@]}" \
            --repo "${REPOSITORY}" \
            --target "${BRANCH}" \
            --prerelease \
            --title "${title}" \
            --notes-file "${NOTES_PATH}"
    fi
}

echo "Publishing dated release ${TAG}..."
publish_release "${TAG}" "Development Build — ${DATE}"

# Keep a stable prerelease URL for development provisioning. The dated release
# above remains available if this moving channel upload fails or needs rollback.
echo "Updating the stable development channel ${CHANNEL_TAG}..."
publish_release "${CHANNEL_TAG}" "Latest Development Build — ${DATE}"

echo "Published ${TAG}: https://github.com/${REPOSITORY}/releases/tag/${TAG}"
echo "Updated ${CHANNEL_TAG} x86_64 asset: https://github.com/${REPOSITORY}/releases/download/${CHANNEL_TAG}/cocreate-server-node-linux-x86_64.tar.gz"
echo "Updated ${CHANNEL_TAG} arm64 asset: https://github.com/${REPOSITORY}/releases/download/${CHANNEL_TAG}/cocreate-server-node-linux-arm64.tar.gz"
