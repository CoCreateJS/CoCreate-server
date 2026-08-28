#!/usr/bin/env bash
# ==============================================================================
# CoCreate WebService Startup Script (Cloud-Init / User Data)
# Zero-Trust / Immutable Node Lockdown
# ==============================================================================
set -euo pipefail

if [ "${EUID}" -ne 0 ]; then
  echo "[CoCreate] This script must be run as root: sudo bash $0" >&2
  exit 1
fi

# ------------------------------------------------------------------------------
# 1. Host System Directories Preparation
# ------------------------------------------------------------------------------
echo "[CoCreate] Preparing workspace directories..."
install -d -o ubuntu -g ubuntu /var/log/cocreatews
install -d -o root -g root /etc/cocreatews

# ------------------------------------------------------------------------------
# 2. Linux Swap Space Provisioning (4GB Fixed Safety Net)
# ------------------------------------------------------------------------------
if ! grep -q '/swapfile' /etc/fstab; then
  echo "[CoCreate] Configuring 4GB disk swap space..."
  fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
else
  echo "[CoCreate] Swap file already present, skipping swap creation."
fi

# ------------------------------------------------------------------------------
# 3. Download the latest application binary from GitHub Releases
# ------------------------------------------------------------------------------
APP_BINARY=/usr/local/bin/cocreatews-linux-x86
APP_DOWNLOAD_URL=https://github.com/CoCreate-app/CoCreateWS/releases/latest/download/cocreatews-linux-x86

echo "[CoCreate] Downloading the latest application binary..."
DOWNLOAD_FILE=$(mktemp /tmp/cocreatews-linux-x86.XXXXXX)
trap 'rm -f "${DOWNLOAD_FILE}"' EXIT

if ! curl --fail --location --silent --show-error \
  --retry 5 --retry-delay 2 --retry-all-errors \
  "${APP_DOWNLOAD_URL}" --output "${DOWNLOAD_FILE}"; then
  echo "[CoCreate] Failed to download ${APP_DOWNLOAD_URL}." >&2
  exit 1
fi

if [ ! -s "${DOWNLOAD_FILE}" ]; then
  echo "[CoCreate] Downloaded application binary is empty." >&2
  exit 1
fi

install -o root -g root -m 0755 "${DOWNLOAD_FILE}" "${APP_BINARY}"
rm -f "${DOWNLOAD_FILE}"
trap - EXIT

# ------------------------------------------------------------------------------
# 4. Systemd Service Unit Provisioning
# ------------------------------------------------------------------------------
echo "[CoCreate] Creating systemd service unit..."
cat << EOF > /etc/systemd/system/cocreatews.service
[Unit]
Description=CoCreate WebService Node
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
Restart=always
RestartSec=3
NoNewPrivileges=true
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE

# Environment Variables
Environment=NODE_ENV=production
Environment=HTTP_PORT=80
Environment=HTTPS_PORT=443
Environment=organization_id=5ff747727005da1c272740ab

# Execution & Logging
ExecStartPre=/usr/bin/test -x ${APP_BINARY}
ExecStart=/usr/bin/env "storage.mongodb.provider=mongodb" "storage.mongodb.url=mongodb+srv://cocreate-app:F98HAalM9qVZxfcU@cocreatedatabase.ne3tel6.mongodb.net/?retryWrites=true&w=majority" ${APP_BINARY}
StandardOutput=append:/var/log/cocreatews/output.log
StandardError=append:/var/log/cocreatews/error.log

# Graceful Shutdown for AWS Spot Interruption (2-minute / 120s warning)
# systemd sends SIGTERM first and grants 110s for connection draining & metrics flush
KillSignal=SIGTERM
TimeoutStopSec=110

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd daemon and enable service
systemctl daemon-reload
systemctl enable cocreatews

# ------------------------------------------------------------------------------
# 5. Boot WebService via Systemd
# ------------------------------------------------------------------------------
echo "[CoCreate] Booting WebService node via systemd..."
systemctl restart cocreatews

# Do not continue to firewall/SSH changes unless the application is healthy.
sleep 2
if ! systemctl is-active --quiet cocreatews; then
  echo "[CoCreate] Service failed to start. Recent logs:" >&2
  journalctl -u cocreatews -n 50 --no-pager >&2
  exit 1
fi

echo "[CoCreate] Service is running on HTTP ${HTTP_PORT:-80} / HTTPS ${HTTPS_PORT:-443}."

# ------------------------------------------------------------------------------
# 6. Security Hardening: Lockdown Server & Close Port 22 (Disable SSH)
# ------------------------------------------------------------------------------
if [ "${LOCK_DOWN_SSH:-0}" != "1" ]; then
  echo "[CoCreate] Startup complete. SSH lockdown skipped (set LOCK_DOWN_SSH=1 to enable it)."
  exit 0
fi

echo "[CoCreate] Locking down server: configuring firewall and disabling SSH..."

if command -v ufw >/dev/null 2>&1; then
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw deny 22/tcp
  ufw --force enable || true
fi

# Stop, disable, and mask SSH daemon so it cannot be started
systemctl stop sshd || systemctl stop ssh || true
systemctl disable sshd || systemctl disable ssh || true
systemctl mask sshd || systemctl mask ssh || true

echo "[CoCreate] Node successfully locked down. HTTP (80) & HTTPS (443) open, SSH (22) disabled."
