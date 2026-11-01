#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPOSITORY="CoCreateJS/CoCreate-server"
BRANCH="dev"
ARCHIVE="cocreatews-node-linux-x64.tar.gz"
RELEASES_DIR="${ROOT}/dist/releases"
DATE_FILE="${RELEASES_DIR}/.dev-release-current"

if [[ ! -s "${DATE_FILE}" ]]; then
    echo "No staged development build found. Run 'yarn build:dev' first." >&2
    exit 1
fi

DATE="$(cat "${DATE_FILE}")"
if [[ ! "${DATE}" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    echo "Invalid staged release date: ${DATE}" >&2
    exit 1
fi

TAG="dev-${DATE}"
CHANNEL_TAG="dev-latest"
RELEASE_DIR="${RELEASES_DIR}/${DATE}"
ARCHIVE_PATH="${RELEASE_DIR}/${ARCHIVE}"
SHA_PATH="${ARCHIVE_PATH}.sha256"
NOTES_PATH="${RELEASE_DIR}/RELEASE-NOTES.txt"

for file in "${ARCHIVE_PATH}" "${SHA_PATH}" "${NOTES_PATH}"; do
    if [[ ! -s "${file}" ]]; then
        echo "Missing staged release file: ${file}. Run 'yarn build:dev' again." >&2
        exit 1
    fi
done

(cd "${RELEASE_DIR}" && sha256sum --check "${ARCHIVE}.sha256")
gh auth status --hostname github.com

publish_release() {
    local tag="$1"
    local title="$2"

    if gh release view "${tag}" --repo "${REPOSITORY}" >/dev/null 2>&1; then
        gh release upload "${tag}" "${ARCHIVE_PATH}" "${SHA_PATH}" \
            --repo "${REPOSITORY}" --clobber
        gh release edit "${tag}" --repo "${REPOSITORY}" \
            --title "${title}" \
            --notes-file "${NOTES_PATH}" --prerelease
    else
        gh release create "${tag}" \
            "${ARCHIVE_PATH}" "${SHA_PATH}" \
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
echo "Updated ${CHANNEL_TAG}: https://github.com/${REPOSITORY}/releases/download/${CHANNEL_TAG}/${ARCHIVE}"
