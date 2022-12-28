---
author: "Roberto Conte Rosito"
title: "Bootstrap-Italia Design Kit with NextJS app"
date: "2022-11-05"
description: "This guide will help you throught the process of configuring bootstrap-italia in your NextJS app"
tags: [
	"bootstrap-italia",
	"boostrapp-italia-design-kit",
	"nextjs"
]
published: true
---

This guide will help you throught the process of configuring [bootstrap-italia](https://github.com/italia/bootstrap-italia/) in your NextJS app

> During this process you will probably face errors related to unrecognized static assets (csv, svg, fonts etc.) that can be solved quite simply in NextJS app using specific webpack config and NextJS components.

# Install Bootstrap-Italia

First of all, install bootstrap-italia in your NextJS app:

```bash
npm i -S bootstrap-italia
```

# Configure Webpack

Now you have to install a plugin, `copy-webpack-plugin`, required to move static assets from the `node_modules` folder (boostrap-italia) in to the project build folder using webpack:

```bash
npm i --save-dev copy-webpack-plugin
```

This will install a new plugin that we have to use inside our next.config.js:

```jsx
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
// Prepare from/to
const from = "node_modules/bootstrap-italia/dist/";
const to = path.join(__dirname, "./public/bootstrap-italia/dist");
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
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

Next time you run your app you will see a new folder, inside public, called bootstrap-italia with all assets required to work with NextJS app.

You can choose to copy these files statically executing a Copy/Paste operation but I prefer this solution to automatically include updates when necessary (when the bootstrap-italia package will be updated).

# Configure \_app.js

Import basic CSS globally in \_app.js adding this code on top of the file:

```jsx
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";

const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
export default App;
```

# Configure Script TAG

Supposing you have a common set of elements necessary to display your page and there exists a file called Layout where all the UX logic starts, you have to add a link to the javascript bundle required by bootstrap-italia to work correctly with you project, like in the example below:

```jsx
import Header from "./Header";
import React from "react";
import Script from "next/script";
const Layout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Script src="bootstrap-italia/dist/js/bootstrap-italia.bundle.min.js" />
  </div>
);
export default Layout;
```

Now you are ready to see a running NextJS app with bootstrap-italia UX.
