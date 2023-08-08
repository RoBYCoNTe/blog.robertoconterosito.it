---

author: "Roberto Conte Rosito"
title: "Setup Google Cloud Storage Service Account"
date: "2023-08-08"
description: "This guide will help you through the process of setting up a Google Cloud Storage Service Account ready to be used in your CI/CD to publish your docker images"
tags: [
	"gcp",
	"docker",
	"container-registry",
	"ci/cd",
	"notes"
]
---

I was in trouble with this for a while so I decided to write down this guide to help me in the future and maybe it will help you too.

The goal is quite simple: I've to create a google service account needed by my pipeline to publish docker images to the Google Cloud Container Registry.

This account **must** have the following permissions:

- App Engine Admin
- Cloud API Gateway Service Agent
- Cloud Deploy Admin
- Cloud Infrastructure Manager Admin
- Container Registry Service Agent
- Environment and Storage Object Administrator

Sorry guys but without these permissions I was not able to make it work!
**Do you know which one is not needed? Please let me know!**
