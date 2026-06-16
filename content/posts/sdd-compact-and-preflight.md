---
title: "Cleaning up large SDD projects: sdd compact and sdd preflight"
date: 2026-06-16T10:00:00+00:00
description: "After a few months of real use, the change-requests/ and bugs/ folders in an SDD project become a graveyard of closed work. Two small commands shipped in 1.9.1 and 1.9.2 bring them back to a sane size."
tags:
  - sdd
  - workflow
  - release
  - ai
---

There is a moment in every project's life when you open the `change-requests/` folder and realize you do not recognise half of the files anymore. The same happens to `bugs/`. They accumulated over weeks of work — change requests that were applied long ago, bugs that someone fixed and forgot. Each of them had a reason to exist at the time. None of them has a reason to be in front of your eyes today.

I noticed this on my own projects first. After a couple of months, the two folders had dozens of `.md` files. Almost all of them were already in their terminal state: `applied` for change requests, `resolved` for bugs. The work was done. The documentation had absorbed their intent. And yet, every time I ran `sdd cr list` or `sdd bug open`, the agent had to read through all of them to figure out what was still relevant. The sync prompt was heavier than it needed to be. The signal was drowning in noise.

The annoying part is that SDD's own documentation says these files "stay in the repository as a record of what was fixed". That is true. But it never said they had to stay *in the way*.

## The shape of the problem

A closed change request is a strange artifact. The change it described has already been folded into the documentation. The code has been written. There is nothing left for anyone — human or agent — to do with it. It is, in every meaningful sense, history. And history is what git is for.

So the question was simple: how do I get those files out of the active set, without losing them, and without risking damage to work that is still open?

## Two tools, one philosophy

I ended up shipping two small commands in two consecutive releases: [`sdd compact`](https://github.com/applica-software-guru/sdd/releases/tag/v1.9.1) in 1.9.1, and [`sdd preflight`](https://github.com/applica-software-guru/sdd/releases/tag/v1.9.2) in 1.9.2. They do different things, but they answer the same anxiety: *is this project actually in the state I think it is?*

`sdd compact` is the broom. It takes change requests marked `applied` and bugs marked `resolved`, and moves them out of sight — into `change-requests/archive/` and `bugs/archive/` by default. Nothing is destroyed. The files are still there, still in git, still recoverable. They are simply no longer in the folders the rest of the toolchain reads from. The next `cr list` is short again. The next sync prompt is light again.

There is a `--purge` option for when you really mean it, and a `--dry-run` for when you want to see what would happen first. But most of the time, the default is what you want: archive, do not delete.

`sdd preflight` is the clipboard you check before sweeping. It answers a slightly different question: *before I tidy up — before I sync, before I merge, before I claim this is done — is there anything I am forgetting?* It looks at five things at once: whether the documentation has broken references, whether any spec is sitting in `new` or `changed` waiting to be implemented, whether anyone left a `draft` around months ago and never enriched it, whether there are pending change requests, and whether there are open bugs. If any of those is true, it tells you, and it exits with an error code.

The two compose the way you would expect:

```bash
sdd preflight && sdd compact
```

Check first, then clean. The project ends up in a state where you can actually think again.

One thing that surprised me when I tested compact against a project connected to SDD Flow: the command never talks to the remote, but the next `sdd push` silently cleans the remote too. The push detects that the archived files are gone and deletes the corresponding entries — the remote follows the local state. Nothing is lost: git has the full history, and the files stay in `archive/` unless you used `--purge`.

## What I learned from writing them

The first version of this idea was a single command with a `--verify` flag. I am glad I split them. `compact` does something irreversible in the working tree — even if archived, files move. `preflight` only reads. Mixing them would have made each of them worse at its job: `compact` impossible to run in a hurry, `preflight` awkward to use anywhere else.

Now I run `preflight` constantly. Before a sync, before a PR, before I walk away from the keyboard at the end of a session. It has become the small ritual that tells me whether I can stop thinking about the project for the day.

## If you want to try it

Both commands are in the latest release of SDD:

```bash
brew upgrade sdd
# or
npm install -g @applica-software-guru/sdd@latest
```

The repository has the full details: [applica-software-guru/sdd](https://github.com/applica-software-guru/sdd). And as always, if you hit friction in your own projects, that friction is probably worth a command — open an issue and tell me about it.
