#!/usr/bin/env bash
# scp -i newTest.pem ./dist/cocreatews-linux-x86 ubuntu@44.202.20.153:/home/ubuntu/
# ssh -i newTest.pem ubuntu@44.202.20.153
# cat ./scripts/startup.sh | ssh -i newTest.pem ubuntu@44.202.20.153 "sudo bash"
# tar czf - ./dist/cocreatews-linux-x86 ./scripts/startup.sh | ssh -i newTest.pem ubuntu@44.202.20.153 "tar xzf - -C /tmp && sudo mv /tmp/dist/cocreatews-linux-x86 /usr/local/bin/ && sudo chmod +x /usr/local/bin/cocreatews-linux-x86 /tmp/scripts/startup.sh && sudo /tmp/scripts/startup.sh"# sudo ./cocreatews-linux-x86 2>&1
# sudo ./cocreatews-linux-x86 2>&1
# sudo /usr/local/bin/cocreatews-linux-x86

# ==============================================================================
# CoCreate WebService Startup Script (Cloud-Init / User Data)
# ==============================================================================
set -euo pipefail

# ------------------------------------------------------------------------------
# 1. Host System Directories Preparation
# ------------------------------------------------------------------------------
echo "[CoCreate] Preparing workspace directories..."
mkdir -p /var/log/cocreatews
mkdir -p /etc/cocreatews

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
# 3. Download Latest Binary (Public GitHub Release - No API Key Needed)
# ------------------------------------------------------------------------------
if [ -f /usr/local/bin/cocreatews-linux-x86 ]; then
  echo "[CoCreate] Binary already present locally at /usr/local/bin/cocreatews-linux-x86, skipping download."
else
  echo "[CoCreate] Fetching latest compiled binary from public GitHub Releases..."
  curl -sL https://github.com/CoCreate-app/CoCreateWS/releases/latest/download/cocreatews-linux-x86 -o /usr/local/bin/cocreatews-linux-x86
fi
chmod +x /usr/local/bin/cocreatews-linux-x86

# ------------------------------------------------------------------------------
# 4. Systemd Service Unit Provisioning
# ------------------------------------------------------------------------------
echo "[CoCreate] Creating systemd service unit..."
cat << 'EOF' > /etc/systemd/system/cocreatews.service
[Unit]
Description=CoCreate WebService Node
After=network.target

[Service]
Type=simple
User=root
Restart=always
RestartSec=3

# Environment Variables
Environment=NODE_ENV=production
Environment=organization_id=5ff747727005da1c272740ab
Environment=storage.mongodb.provider=mongodb
Environment=storage.mongodb.url=mongodb+srv://cocreate-app:F98HAalM9qVZxfcU@cocreatedatabase.ne3tel6.mongodb.net/?retryWrites=true&w=majority

# Execution & Logging
ExecStart=/usr/local/bin/cocreatews-linux-x86
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