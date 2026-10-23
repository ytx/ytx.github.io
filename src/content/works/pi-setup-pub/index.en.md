---
title: pi-setup-pub
summary: Turn a Raspberry Pi into a finished device with one command.
---

Ansible roles and playbooks that turn a freshly written Raspberry Pi OS SD card into a finished device, such as a kiosk screen, a camera or a small server, with one command, the same way every time. It is published as teaching material for lectures and seminars on running Raspberry Pis as appliances.

Each role is one piece: a read-only root filesystem, a watchdog, a static IP, Wi-Fi fallback, an RTC, a fan case and so on. A playbook says which roles make one kind of device, and settings per host and per group live in inventory files. Passwords and keys go in a directory outside the repository, so your own hosts and secrets can stay in a private repository that uses these roles.

The roles come from the author's own working setup and are moved here a few at a time with the site-specific parts taken out. They are developed on Raspberry Pi OS based on Debian 13 (trixie); the controller needs Linux or macOS with Python 3.10 or later, or another Pi. MIT licensed.
