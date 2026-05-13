---
author: "Roberto Conte Rosito"
title: "Publishing Superset Dashboards in React/Next.js Applications"
date: "2023-01-02"
description: "A guide to publishing and embedding a Superset dashboard in a React/Next.js application."
tags: [
	"superset",
  "react",
  "nextjs"
]
---

Superset is a great tool for creating and publishing dashboards. In this post, I'll show you how to publish and embed a Superset dashboard in a React/Next.js application.

## Configure Superset

Superset provides everything required to publish dashboards, but you need to configure a few things first. This guide assumes you have already installed Superset.

Open `config.py` and make these changes:

- search for `ENABLE_CORS` and set it to `True`;
- replace `CORS_OPTIONS` (which should be located after `ENABLE_CORS`) with this:

```python
CORS_OPTIONS = {
  'supports_credentials': True,
  'allow_headers': ['*'],
  'resources': ['*'],
  'origins': ['*']
}
```

> The `origins` property should be configured according to your requirements. In development, you can use `*` to allow all origins, but in production you should specify your application's domain.

- search for `EMBEDDED_SUPERSET` and set it to `True`;
- search for `PUBLIC_ROLE_LIKE` and set it to `Public`;
- search for `GUEST_TOKEN_JWT_SECRET` and set it to a random string to enforce security.

Restart your Superset instance to apply the changes.

## Configure Public Role

The Public role needs to include the following permissions:

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

Without these permissions, you will not be able to publish your dashboard. You will get a 403 error when trying to access it.

## Configure Guest Account

Next, configure a guest account that will be used to access the dashboard without a username and password. Go to `Settings/List Users` and create a new user. The most important part is the **Roles** field: assign both the **Public** and **Gamma** roles.

## Set Up Your React/Next.js App

Superset includes the `@superset-ui/embedded-sdk` package, which helps with the embedding process. On top of that, I've created another wrapper that uses a React component to display data and handle DOM initialization.

Install the package:

```bash
npm i -S superset-dashboard-sdk
```

To publish a dashboard, you need to create a new data provider. This class will be used to fetch data from Superset. It extends `DefaultDataProvider`, which wraps the `SupersetClient` class from the `@superset-ui/embedded-sdk` package.

```jsx
// dataProvider.js
import { DefaultDataProvider } from 'superset-dashboard-sdk';

const dp = new DefaultDataProvider('http://localhost:8088', {
  username: 'guest',
  password: 'guest',
});

export default dp;
```

Then you can use the data provider to publish your dashboard:

```jsx
// index.js
import { Dashboard } from 'superset-dashboard-sdk';
import dataProvider from './dataProvider';

const App = () => <Dashboard dataProvider={dataProvider} id="<dashboard-id>" />;
```

To obtain a valid dashboard ID, open Superset, navigate to the dashboard, and click on the "..." menu in the top-right corner. Then select **Enable Embedding** to generate and view the UUID associated with the selected dashboard. Also remember to add the **Guest** account to the list of dashboard owners to avoid permission issues.

I hope this helps. Feel free to leave a comment if you have any questions or suggestions.
