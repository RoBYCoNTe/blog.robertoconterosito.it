---
author: "Roberto Conte Rosito"
title: "Setup HTTPS with Nginx and Docker"
date: "2023-02-28"
description: "This guide will help you through the process of configuring HTTPS with Nginx and Docker"
tags: [
	"nginx",
  "docker",
  "https",
  "notes"
]
---

_Welcome back to my dev notes!_

Today I was in trouble for a while because I wanted to setup HTTPS with Nginx
and Docker and I completely forgot how to do it. So I decided to write down
this guide to help me in the future and maybe it will help you too.

I have a Docker container running a PHP application served by Nginx and I
wanted to setup HTTPS with a self-signed certificate because I need to test
some OAuth flows.

Follow these steps to setup HTTPS with Nginx and Docker:

# Create a self-signed certificate

```bash
openssl x509 -outform pem -in localhost.crt -out localhost.pem
```

# Edit nginx configuration

Please take attention to the `ssl_certificate` and `ssl_certificate_key` files paths.

```nginx
server {
  listen 443 ssl;
  server_name localhost;
  ssl_certificate /etc/nginx/ssl/localhost.crt;
  ssl_certificate_key /etc/nginx/ssl/localhost.key;
  ...
}
```

# Restart docker

If you are a perfectionist like me you can also add the certificate to your
system keychain to avoid browser warnings. Using Mac OS you can do it like
this:

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain localhost.crt
```

Enjoy!
