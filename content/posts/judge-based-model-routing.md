---
title: "Judge-based model routing: cheap by default, expensive when it matters"
date: "2026-10-01"
description: "A judge model picks the model for each request, and a probe moves the session to another provider before the credits run out."
draft: false
tags:
  - ai
  - agents
  - llm
  - routing
---

A cost report over five weeks of using [pi](https://github.com/earendil-works/pi) as my daily coding agent showed that 42% of the bill came from a few frontier models, while the cheap tiers were already billing me at cache-read rates. The price per token was not the problem. A session runs on one model from the first request to the last, so the model chosen for a hard problem kept serving the parts where the agent only reads files and runs commands.

[judge-router](https://github.com/RoBYCoNTe/pi-judge-router) is the extension I wrote for that. It registers one virtual model, `judge/auto`, and picks a model per request from four roles.

## The four roles

| Role | Default | Governs |
|---|---|---|
| `judge` | `typesafe/jev-latest` | the classifier that rates task complexity |
| `cheap` | `zai/glm-5.3-flash` | planning for ordinary tasks |
| `strong` | `zai/glm-5.3` | planning for tasks the judge calls complex |
| `exec` | `deepseek/deepseek-flash` | implementation and compaction |

The first request of a session goes to the judge, which rates the task and picks the cheap or the strong planner. After the first successful edit or write the session moves to the exec model and stays there. A retry stays on the model that answered, and compaction goes to exec. One switch per session, on purpose: a new model loses the warm prompt cache, and on a long context that re-read costs more than the difference in price.

Roles are environment variables, and a session can override any of them without restarting:

```
/judge-models strong fireworks/accounts/fireworks/models/glm-5p3
```

## Two findings worth passing on

### pi does not retry a credit error

Its retry classifier covers overloaded providers, rate limits, timeouts and 5xx responses, and treats `insufficient_quota`, `out of budget`, `quota exceeded` and `billing` as final. The retry hook an extension would normally use never fires when the balance runs out, so the router reads the provider's balance before dispatching and uses an equivalent model elsewhere when the provider is exhausted. Waiting for the error is not a strategy.

### A virtual model hides the provider

My provider indicator extensions went quiet, because they read the selected model's provider to decide what to poll and the selected provider is now `judge`, which is no vendor. The router is the only component that knows both the dispatched model and each provider's quota, so it prints them itself, including the session cost split per provider. That split matters, because the providers do not bill in the same way: one is a prepaid balance, the other a plan counted in quota percentages.

## What it saves

| | Before (measured, 195 sessions) | With the router (projected) |
|---|---|---|
| Share of the bill from frontier models | 42% | 11% (4% to 25%) |
| Total bill, relative to before | 100 | 66 (61 to 78) |

This is a repricing of the same tokens rather than a quality claim, and it is not a benchmark. The probe fails open: a changed payload, a timeout or a 401 means "use the primary model", so a parser gone stale costs the fallback and never the session.

## Try it

The project is MIT licensed and lives at [github.com/RoBYCoNTe/pi-judge-router](https://github.com/RoBYCoNTe/pi-judge-router). The routing rules, the parsers, the formatting and the usage store live in separate files, with 92 tests that need no network and no credentials.

```bash
pi install git:github.com/RoBYCoNTe/pi-judge-router
pi --model judge/auto
```
