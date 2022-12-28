---
author: "Roberto Conte Rosito"
title: "Deploy a local kind cluster"
date: "2022-12-19"
description: "This guide will help you throught the process of deploying a local kind cluster"
tags: ["kind", "kind-cluster", "kubernetes", "k8s"]
published: true
---

This guide will help you throught the process of deploying a local [kind](https://kind.sigs.k8s.io/) cluster.

> Kind is a tool for running local Kubernetes clusters using Docker container “nodes”. Kind was primarily designed for testing Kubernetes itself, but may be used for local development or CI.

# Prerequisites

This guide assumes you have alreay installed:

- [Docker](https://docs.docker.com/get-docker/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)

# Create a cluster

Create a kind config file called `kind-config.yaml` with the following content:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
```

Then create the cluster using the following command:

```bash
kind create cluster --config kind-config.yaml
```

The configured cluster is ready to accept requests on port 80 and 443.

# Install ingress controller

By default k8s does not have an ingress controller installed. To install the ingress controller run the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

This will install the **nginx** ingress controller in the cluster (the most used ingress controller right now, but you can install many other, the only thing you have to do is to change the `ingressClassName` in your ingress resources).

# Test the cluster

To test the cluster you can create a simple deployment and a service:

```bash
kubectl run hello \
  --expose \
  --image nginxdemos/hello:plain-text \
  --port 80
```

Then create a file called `ingress.yaml` with the following content:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello
spec:
  rules:
    - host: hello.robertoconterosito.it
      http:
        paths:
          - pathType: ImplementationSpecific
            backend:
              service:
                name: hello
                port:
                  number: 80
```

Then apply the ingress resource:

```bash
kubectl apply -f ingress.yaml
```

Now you can test the ingress resource using the following command:

```bash
curl -H "Host: hello.robertoconterosito.it" localhost
```
