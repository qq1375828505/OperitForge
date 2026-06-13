#!/bin/bash
# Quick environment setup script
# Run: bash setup_env.sh

echo "=== Environment Setup ==="

# Update package list
echo "[1/4] Updating package list..."
apt update -qq > /dev/null 2>&1

# Install essential tools
echo "[2/4] Installing essential tools..."
ESSENTIALS="procps iputils-ping net-tools curl wget git vim htop tree jq nano python3"
for pkg in $ESSENTIALS; do
    if ! dpkg -l | grep -q "^ii  $pkg "; then
        echo "  Installing $pkg..."
        apt install -y -qq $pkg > /dev/null 2>&1
    else
        echo "  ✅ $pkg already installed"
    fi
done

# Fix DNS if needed
echo "[3/4] Checking DNS..."
if ! nslookup google.com > /dev/null 2>&1; then
    echo "  Fixing DNS..."
    echo "nameserver 8.8.8.8" > /etc/resolv.conf
    echo "nameserver 8.8.4.4" >> /etc/resolv.conf
fi

# Verify installation
echo "[4/4] Verifying installation..."
ALL_OK=true
for cmd in ps ping curl git python3 vim jq; do
    if ! which $cmd > /dev/null 2>&1; then
        echo "  ❌ $cmd missing"
        ALL_OK=false
    fi
done

if $ALL_OK; then
    echo ""
    echo "✅ Environment setup complete!"
    echo "Run 'bash health_check.sh' to verify."
else
    echo ""
    echo "⚠️ Some tools failed to install. Check errors above."
fi