---
title: webarchive-server
summary: Notes, tags and search for the web pages you save.
---

A local server that keeps web pages saved with the [SingleFile](https://www.getsinglefile.com/) browser extension in a synced folder such as Dropbox, and lets you add notes and tags to them and search them. It runs on your own computer, and you use its list and detail views in the browser.

Any folder that appears as a local directory will do: besides Dropbox, folders synced by iCloud Drive, OneDrive, Google Drive for desktop, Syncthing and the like. The server uses no service's API; it only writes files and watches the folder, so several computers can share one archive. Conflict copies created by the sync service are marked as "conflict" in the list.

With Node.js 22.13 or later, install it with `npm install -g github:ytx/webarchive-server` and start it with `webarchive`. The settings page opens on first start; choose the archive folder and you are ready. On macOS and Windows it can be registered as a service that starts when you log in. Keep the synced folder available offline rather than using "online-only" style settings that leave no local copy.
