#!/bin/bash
# Terminal Environment Health Check
# Run: bash health_check.sh

echo "=== Terminal Health Check ==="
echo ""

echo "[1/6] OS Info:"
uname -a
echo ""

echo "[2/6] Shell Tools:"
for cmd in ps htop ping curl wget git python3 vim nano tree jq; do
    if which $cmd > /dev/null 2>&1; then
        echo "  ✅ $cmd: $(which $cmd)"
    else
        echo "  ❌ $cmd: NOT FOUND (install: apt install -y $cmd)"
    fi
done
echo ""

echo "[3/6] Network Connectivity:"
if ping -c 1 -W 3 8.8.8.8 > /dev/null 2>&1; then
    echo "  ✅ Internet: reachable"
else
    echo "  ❌ Internet: unreachable"
fi
echo ""

echo "[4/6] Storage:"
df -h /storage/emulated/0 2>/dev/null || df -h /sdcard 2>/dev/null || echo "  ⚠️ Cannot read storage info"
echo ""

echo "[5/6] Memory:"
cat /proc/meminfo | head -3
echo ""

echo "[6/6] DNS Resolution:"
if nslookup google.com > /dev/null 2>&1; then
    echo "  ✅ DNS: working"
else
    echo "  ❌ DNS: failed (try: echo 'nameserver 8.8.8.8' > /etc/resolv.conf)"
fi

echo ""
echo "=== Health Check Complete ==="