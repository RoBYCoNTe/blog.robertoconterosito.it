---
author: "Roberto Conte Rosito"
title: "Bootstrap Italia Design Kit with Next.js"
date: "2022-11-05"
description: "Configure Bootstrap Italia in a Next.js app."
tags: [
	"bootstrap-italia",
	"boostrapp-italia-design-kit",
	"nextjs"
]
---

This guide will help you through the process of configuring [Bootstrap Italia](https://github.com/italia/bootstrap-italia/) in your Next.js app.

> During this process, you will probably face errors related to unrecognized static assets (CSV, SVG, fonts, etc.) that can usually be solved in a Next.js app using a specific webpack configuration and Next.js components.

## Install Bootstrap-Italia

First of all, install Bootstrap Italia in your Next.js app:

```bash
npm i -S bootstrap-italia
```

## Configure Webpack

Now you have to install a plugin, `copy-webpack-plugin`, required to move static assets from the `node_modules` folder (`bootstrap-italia`) into the project build folder using webpack:

```bash
npm i --save-dev copy-webpack-plugin
```

This will install a new plugin that we have to use inside our `next.config.js`:

```jsx
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
// Prepare from/to
const from = "node_modules/bootstrap-italia/dist/";
const to = path.join(
  __dirname,
  "./public/bootstrap-italia/dist"
);
const nextConfig = {
  webpack: (config, {
    buildId, dev, isServer, defaultLoaders, webpack
  }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from, to }],
      })
    );
    return config;
  },
};
module.exports = nextConfig;
```

The next time you run your app, you will see a new folder inside `public` called `bootstrap-italia`, with all the assets required to work with a Next.js app.

You can choose to copy these files statically by using a copy-and-paste operation, but I prefer this solution because it automatically includes updates when the `bootstrap-italia` package is updated.

## Configure `\_app.js`

Import the base CSS globally in `\_app.js` by adding this code at the top of the file:

```jsx
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
export default App;
```

## Configure Script Tag

Suppose you have a common set of elements needed to display your page, and there is a file called `Layout` where all the UX logic starts. In that case, you have to add a link to the JavaScript bundle required by Bootstrap Italia to work correctly with your project, as in the example below:

```jsx
import Header from "./Header";
import React from "react";
import Script from "next/script";
const Layout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Script
      src="bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js"
    />
  </div>
);
export default Layout;
```

Now you are ready to see a running Next.js app with Bootstrap Italia UX.
