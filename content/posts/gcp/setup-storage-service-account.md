---

author: "Roberto Conte Rosito"
title: "Set Up Google Cloud Storage Service Account"
date: "2023-08-08"
description: "Set up a Google Cloud Storage service account for CI/CD image publishing."
tags: [
	"gcp",
	"docker",
	"container-registry",
	"ci/cd",
	"notes"
]
---

I struggled with this for a while, so I decided to write down this guide to help me in the future, and maybe it will help you too.

The goal is quite simple: I need to create a Google service account for my pipeline to publish Docker images to Google Cloud Container Registry.

This account **must** have the following permissions:

- App Engine Admin
- Cloud API Gateway Service Agent
- Cloud Deploy Admin
- Cloud Infrastructure Manager Admin
- Container Registry Service Agent
- Environment and Storage Object Administrator

Without these permissions, I wasn't able to make it work.

**Do you know which one is not needed? Please let me know!**
