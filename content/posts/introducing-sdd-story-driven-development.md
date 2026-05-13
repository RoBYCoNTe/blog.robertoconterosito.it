---
title: "Introducing SDD — Story Driven Development"
date: 2026-05-13T08:00:00+00:00
description: "A short, high-level introduction to SDD: what it is, why it was created, and where to find the project."
tags:
  - sdd
  - story-driven
  - spec-driven
  - ai
---

Over the past months I have been experimenting with agent-assisted development and distilled a simple idea with far-reaching consequences: treat the story of a product — its goals, users, behaviors, and edge cases — as the single source of truth, and let tooling translate that story into code.

Why SDD was created

As AI-assisted development became practical, I noticed a recurring problem: agent-generated code can drift away from the original intent when decisions are scattered across prompts, notes, and individual commits. SDD was developed while I was working at my company, together with a colleague, to keep intent central. Instead of chasing context across tools and prompts, I keep a single living narrative that documents why a system exists and how it should behave.

What SDD brings

- Clarity: a single document (the Story) that helps me explain the product at a human level.
- Continuity: evolution of features and fixes happens in the Story, making project history easier for me to understand.
- Portability: the approach is agent-agnostic — the Story can be used with different coding assistants or workflows.

This is not about replacing developers. For me, it's about having a durable artifact that guides development, especially when I use automated agents to assist implementation.

Where to learn more

For technical details, installation instructions, examples, and the full documentation, visit the project's homepage on GitHub: https://github.com/applica-software-guru/sdd. The repository contains a clear README and a docs/ folder with step-by-step guides.

You can also find the published package on npm: https://www.npmjs.com/package/@applica-software-guru/sdd

If you're curious, start by reading the README on GitHub — it's written to give both the big picture and the next steps for trying SDD in a small project.
