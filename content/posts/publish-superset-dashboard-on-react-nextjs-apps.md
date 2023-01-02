---
author: "Roberto Conte Rosito"
title: "Publish superset dashboard on React/NextJS apps"
date: "2023-01-02"
description: "Publish and embed superset dashboard on React/NextJS apps easy and fast"
tags: [
	"superset",
  "react",
  "nextjs"
]
---

Superset is a great tool to create and publish different kind of dashboards. In this post I will show you how to publish and embed a superset dashboard on a React/NextJS app.

## Configure Superset

Superset expose everything required to publish data but you need to configure few things before start (this guide assumes you have already installed superset).

Open `config.py` and add these changes:

- search `ENABLE_CORS` and change it to `True`;
- replace `CORS_OPTIONS` (should be located after `ENABLE_CORS`) with this:

```python
CORS_OPTIONS = {
  'supports_credentials': True,
  'allow_headers': ['*'],
  'resources':['*'],
  'origins': ['*']
}
```

> The `origins` property should be configured based on your requirements, in development mode you can use `*` to allow all origins but in production you should specify the domain of your app.

- search `EMBEDDED_SUPERSET` and change it to `True`;
- search `PUBLIC_ROLE_LIKE` and change it to `Public`;
- search `GUEST_TOKEN_JWT_SECRET` and change it to random string to enforce security.

Restart your superset instance to activate the changes.

## Configure public role

Public role needs to be updated with the following permissions:

- can read on Chart
- can read on Dataset
- can read on Dashboard
- can read on Database
- can write on DashboardFilterStateRestApi
- can read on DashboardfilterStateRestApi
- can dashboard on Superset
- can explore json on Superset
- can grant guest token on SecurityRestApi
- all database access on all_database_access

Without these permissions you will not be able to publish your dashboard (
you will get a 403 error when you will try to access the dashboard).

## Configure guest account

Now you are ready to configure guest account that will be used to access dashboard without username and password. Go in Settings/List Users and create a new user, the most important part is the **Roles** field, you have to select **Public** and **Gamma** roles.

## Setup your React/NextJS app

Superset comes out with a default NPM plugin, @superset-ui/embedded-sdk, that helps in the process of publication. On top of this I've created another wrapper that uses React component to display data and take care of DOM initialization.

Install the package:

```bash
npm i -S superset-dashboard
```

To publish a dashboard you need to create a new data provider, this is a class that will be used to fetch data from superset. The data provider is a class that extends `DefaultDataProvider` and it's used to fetch data from superset. The `DefaultDataProvider` class is a wrapper of `SupersetClient` class that comes out with `@superset-ui/embedded-sdk` package.

```jsx
// dataProvider.js
import { DefaultDataProvider } from 'superset-dashboard';
const dp = new DefaultDataProvider("http://localhost:8088", {
  username: "guest"
  password: "guest"
});
export default dp;
```

Then you can use the data provider to publish your dashboard:

```jsx
// index.js
import { Dashboard } from "superset-dashboard";
import dataProvider from "./dataProvider";
const App = () => <Dashboard dataProvider={dp} id="<id of dashboard>" />;
```

To obtain a valid dashboard id you can open superset, navigate to dashboard and click on "..." (three dots) on the top right corner. Then click on **Enable Embedding** to generate and see the uuid associated with selected dashboard. Also remember to add **Guest** account to the list of owners of the dashboard to avoid problems with permissions.

Hope this helps you too, feel free to write a comment if you have any question or suggestion.
