---
author: "Roberto Conte Rosito"
title: "Set Up HTTPS with Nginx and Docker"
date: "2023-02-28"
description: "Configure HTTPS with Nginx and Docker."
tags: [
	"nginx",
  "docker",
  "https",
  "notes"
]
---

_Welcome back to my dev notes!_

I ran into this problem while setting up HTTPS with Nginx and Docker, and I realized I had forgotten the exact steps. I decided to write them down so I can refer to them later, and hopefully they will help you too.

I have a Docker container running a PHP application served by Nginx, and I wanted to set up HTTPS with a self-signed certificate because I need to test some OAuth flows.

Follow these steps to set up HTTPS with Nginx and Docker:

## Create a self-signed certificate

```bash
openssl x509 -outform pem -in localhost.crt -out localhost.pem
```

## Edit the Nginx configuration

Pay attention to the paths for `ssl_certificate` and `ssl_certificate_key`.

```nginx
server {
  listen 443 ssl;
  server_name localhost;
  ssl_certificate /etc/nginx/ssl/localhost.crt;
  ssl_certificate_key /etc/nginx/ssl/localhost.key;
  ...
}
```

## Restart Docker

If you want to avoid browser warnings, you can also add the certificate to your system keychain. On macOS, you can do it like this:

```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain localhost.crt
```

Enjoy!
