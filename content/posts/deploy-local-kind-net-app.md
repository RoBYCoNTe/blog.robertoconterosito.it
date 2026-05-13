---
author: "Roberto Conte Rosito"
title: "Deploy a .NET App on a Local Kind Cluster"
date: "2022-12-20"
description: "How to deploy a .NET app on a local kind cluster."
tags: ["kind", "kind-cluster", "kubernetes", "k8s", "net-app"]
---

This guide will help you through the process of deploying a .NET app on a local [kind](https://kind.sigs.k8s.io/) cluster. I was curious to see how it works, so I decided to write an article about it after studying the correct approach.

## Prerequisites

This guide assumes you have already installed:

- [Docker](https://docs.docker.com/get-docker/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)

You can follow the guide
[Deploy a local kind cluster](/posts/deploy-local-kind-cluster/) to install all the prerequisites, or you can install kind and ingress-nginx as quickly as possible by running the following commands:

```bash
kind create cluster --config kind/config.yaml
kubectl apply -f \
  https://raw.githubusercontent.com/kubernetes/\
ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
```

And you're ready to go!

## Create a .NET App

I've created a GitHub repo with a simple .NET app that will be deployed on the kind cluster. You can find it [here](https://github.com/RoBYCoNTe/hello-world-k8s-net). The app is a simple web API that returns a string or interacts with files to test my understanding of volumes.

You can try it locally by running the following commands:

```bash
git clone https://github.com/RoBYCoNTe/hello-world-k8s-net.git
cd hello-world-k8s-net
dotnet restore
dotnet run
```

The app will be available on port 5000, and you can test it by running the following commands:

```bash
curl http://localhost:5000/v1
curl http://localhost:5000/v1/files/append?line=Hello
```

## Create a Dockerfile

Using Kubernetes, we can deploy a containerized application. To do that, we need to create a Dockerfile that will be used to build the image deployed on the cluster.

Inside the repo, you can find a Dockerfile already prepared. You can find it [here](https://github.com/RoBYCoNTe/hello-world-k8s-net/blob/main/Dockerfile).

Before building the image, you have to log in to your Docker Hub account. To do that, run the following command:

```bash
docker login
```

Then build the image by running the following command:

```bash
docker build \
  -t <your-docker-hub-username>/hello-world-k8s-net:latest .
```

## Push the Image to Docker Hub

To push the image to Docker Hub, run the following command:

```bash
docker push <your-docker-hub-username>/hello-world-k8s-net:latest
```

## Deployment

Now that we have the image ready, we can create a deployment that will deploy the image on the cluster. Before creating the deployment, you have to instruct your cluster to pull the image from Docker Hub. To do that, run the following command:

```bash
kubectl create secret docker-registry dockerhub \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<your-docker-hub-username> \
  --docker-password=<your-docker-hub-password> \
  --docker-email=<your-docker-hub-email>
```

With the previous command, we created a secret that the deployment will use to pull the image from Docker Hub. For more information about how to configure a secret for pulling an image from Docker Hub, you can read [this](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/) article.

The deployment is defined in the file [deployment.yaml](https://github.com/RoBYCoNTe/hello-world-k8s-net/blob/main/k8s/deployment.yml). You can find it in the repo.

Before creating the deployment, we have to create PVCs that will be used by the deployment to store data. To do that, run the following commands:

```bash
kubectl apply -f k8s/pv.yaml
kubectl apply -f k8s/pvc.yaml
```

Without the PVCs, the deployment will fail because it will not be able to store data.

Now we can create the deployment by running the following command:

```bash
kubectl apply -f k8s/deployment.yaml
```

**Remember** to change the image name in the deployment file to your own image name.

Now we can create a Service and Ingress to expose the app to the outside world. To do that, run the following commands:

```bash
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

**Remember** to change the host in the ingress file to your own host and to add the host to your `/etc/hosts` file (if you are using Linux) or to your `hosts` file (if you are using Windows).

## Test the App

To test the app run the following commands:

```bash
curl -H "Host: hello-world-k8s-net.local" http://localhost/v1
```

You should see the classic "Hello World!" message.

I was just curious to see how volumes work on a local kind cluster. To test it run the following commands:

```bash
curl -H "Host: hello-world-k8s-net.local" \
  http://localhost/v1/files/append?line=Hello
```

If you execute the previous command multiple times, you will see that the file is updated with the new line. Furthermore, if you delete the pod or restart the cluster, the file will still be there.

For example, if we redeploy the app by running the following command:

```bash
kubectl rollout restart deployment hello-world-k8s-net
```

Executing the `curl` command again will return the same result.

## Conclusion

This guide was just a way to test how volumes work on a local kind cluster. I learned that volumes are not deleted when you delete a pod or restart the cluster. I also learned that you can use a secret to pull an image from Docker Hub. I have to say that my first attempts were not successful because I was using the wrong secret, missing the ingress-nginx installation, and forgetting to create the PVCs. I learned that you have to read error messages carefully and try to understand what is going on. Most of the time the messages are pretty clear, and if not, you can always ask for help on the internet.

I hope you enjoyed this guide and learned something new. If you have any questions or suggestions, please leave a comment below.
