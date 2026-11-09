/** Ubuntu cloud-init script used to bootstrap a CoCreate Server runtime archive. */
const startupScript = `#!/usr/bin/env bash
set -euo pipefail
umask 077

ARCHIVE_URL={{binaryUrl}}
ORGANIZATION_ID={{organizationId}}
SERVER_ID={{serverId}}
CLUSTER_ID={{clusterId}}
HOST={{host}}
STORAGE_BASE64={{storageBase64}}
BOOTSTRAP_CONFIG_BASE64={{bootstrapConfigBase64}}
INSTALL_DIR=/opt/cocreatews

apt-get update
apt-get install -y ca-certificates curl tar
mkdir -p "$INSTALL_DIR"
mkdir -p /etc/cocreatews
curl --fail --location --retry 3 "$ARCHIVE_URL" -o /tmp/cocreate-server.tar.gz
tar -xzf /tmp/cocreate-server.tar.gz -C "$INSTALL_DIR"
chmod 755 "$INSTALL_DIR/node"

printf 'organization_id=%s\\nserver_id=%s\\ncluster_id=%s\\nhost=%s\\n' \\
  "$ORGANIZATION_ID" "$SERVER_ID" "$CLUSTER_ID" "$HOST" > /etc/cocreatews.environment
printf '%s' "$STORAGE_BASE64" | base64 --decode > /etc/cocreatews/storage.json
printf '%s' "$BOOTSTRAP_CONFIG_BASE64" | base64 --decode > /root/CoCreate.config.js
chmod 600 /etc/cocreatews.environment /etc/cocreatews/storage.json /root/CoCreate.config.js

exec "$INSTALL_DIR/node" "$INSTALL_DIR/index.js" --cocreate-host-setup
`;

export default startupScript;
