---
layout: post
title: Docker API Exposure via Tailscale VPN - Linux Setup Guide
date: 2025-06-07 22:37:00+1000
description: This guide shows how to expose Docker's API (port 2376) to your Tailscale VPN network on Linux systems.
tags: Docker, Tailscale, Linux
categories: Self-hosted
giscus_comments: true
related_posts: true
toc:
  sidebar: right
---

## Overview

This guide shows how to expose Docker's API (port 2376) to your Tailscale VPN network on Linux systems. It's a simple guide for those who want to use Docker remotely or access the status of Docker Containers from another device.

> ##### WARNING
>
> We're using port 2376 but **without SSL/TLS encryption**. Thus, you need to use a VPN tunnel to provide encryption and access control.
{: .block-warning }

## Prerequisites

- Docker installed and running on Linux
- Tailscale VPN installed and connected
- sudo/root access to the system

## Step 1: Find Your Tailscale IP Address

```bash
# Get your Tailscale IP
tailscale ip -4
```
Note the IP address (e.g., `100.xxx.xxx.xxx`) - you'll need this later.

## Step 2: Configure Docker Daemon

### Using systemd Override (Recommended)

```bash
# Create systemd override
sudo systemctl edit docker.service
```

Add this configuration (replace `100.xxx.xxx.xxx` with your actual Tailscale IP):
```ini
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H unix:///var/run/docker.sock -H tcp://100.xxx.xxx.xxx:2376 --containerd=/run/containerd/containerd.sock
```

## Step 3: Apply Configuration

```bash
# Reload systemd and restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# Verify Docker is running
sudo systemctl status docker
```

## Step 4: Configure Firewall

### For UFW (Ubuntu/Debian):

```bash
# Install UFW if not present
sudo apt install ufw -y

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow ssh

# Allow existing services
sudo ufw allow 80
sudo ufw allow 443

# Allow Docker API from Tailscale network
sudo ufw allow from 100.64.0.0/10 to any port 2376

# Enable UFW
sudo ufw enable

# Check status
sudo ufw status numbered
```

### For iptables (Direct method):

```bash
# Add rule to allow Docker API from Tailscale network
sudo iptables -I INPUT -p tcp --dport 2376 -s 100.64.0.0/10 -j ACCEPT

# Save rules (method varies by distribution)
# Ubuntu/Debian:
sudo iptables-save > /etc/iptables/rules.v4

# CentOS/RHEL:
sudo service iptables save
```

## Step 5: Verify Setup

```bash
# Check if Docker is listening on the correct port
sudo ss -tlnp | grep :2376

# Check your Tailscale IP
tailscale ip -4

# Test local connection
curl http://$(tailscale ip -4):2376/containers/json
```

Expected output should show JSON with container information.

## Step 6: Test from Remote Device

From another device on your Tailscale network:
```bash
# Test Docker connection (replace with your Tailscale IP)
curl http://100.xxx.xxx.xxx:2376/containers/json

# Or test with Docker client
docker -H tcp://100.xxx.xxx.xxx:2376 ps
```

## Security Notes

- ⚠️ **Warning**: This exposes Docker daemon without TLS encryption
- ✅ **Safe**: Tailscale provides encrypted VPN tunnel
- 🔒 **Access**: Only devices on your Tailscale network can connect
- 💡 **Firewall**: Uses Tailscale's CGNAT range (100.64.0.0/10) for access control
- 🛡️ **Best Practice**: Consider using TLS certificates for production environments

## Usage Examples

Once configured, you can use Docker remotely:
```bash
# Set environment variable for easier use (replace with your Tailscale IP)
export DOCKER_HOST=tcp://100.xxx.xxx.xxx:2376

# Now use Docker commands normally
docker ps
docker images
docker run hello-world

# Use with docker-compose remotely
docker-compose ps
docker-compose logs
```


## Troubleshooting

### Docker not listening on port 2376:

```bash
# Check Docker process
ps aux | grep dockerd

# Check systemd service
sudo systemctl cat docker.service | grep ExecStart

# View Docker logs
sudo journalctl -u docker.service -f
```

### Connection refused from remote:

```bash
# Check firewall rules
sudo ufw status
# or
sudo iptables -L -n | grep 2376

# Test local connection first
curl http://localhost:2376/containers/json
```

### Tailscale connectivity issues:

```bash
# Check Tailscale status
tailscale status

# Restart Tailscale
sudo systemctl restart tailscaled

# Re-authenticate if needed
sudo tailscale up
```

### Docker service won't start:

```bash
# Check for configuration conflicts
sudo journalctl -u docker.service --no-pager -l

# Temporarily remove custom config
sudo mv /etc/docker/daemon.json /etc/docker/daemon.json.backup
sudo systemctl restart docker
```
