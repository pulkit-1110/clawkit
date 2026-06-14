# Clawkit

An AI coding assistant for your terminal. clawkit reads, plans, and edits code in
the current workspace using LLMs (via OpenRouter), and can be driven either from
an interactive CLI or remotely through a Telegram bot. File-changing actions are
always staged and require your explicit approval before they touch disk.

## Features

- **Three modes of operation**
  - **Ask** — answer questions about the codebase (read-only).
  - **Plan** — generate a step-by-step plan for a goal, let you toggle which
    steps to run, then execute them.
  - **Agent** — give a task and let the agent work, staging file changes for
    your review.
- **Two interfaces** — an interactive terminal UI (`@clack` prompts) and a
  Telegram bot (`/ask`, `/plan`, `/agent`).
- **Approval-gated edits** — every file create / modify / delete is staged and
  shown as a diff; nothing is written until you approve.
- **Optional web tools** — when a Firecrawl API key is set, the agent can search
  and scrape the web while planning.
- **Built on Bun** with the Vercel AI SDK and the OpenRouter provider.

## Requirements

- [Bun](https://bun.sh) (the project uses a `#!/usr/bin/env bun` entrypoint).
- An [OpenRouter](https://openrouter.ai) API key.
- (Optional) A Telegram bot token if you want to use the Telegram mode.
- (Optional) A Firecrawl API key to enable web search/scrape tools.

## Installation

```bash
git clone <repo-url>
cd clawkit
bun install
```

## Configuration

clawkit reads its settings from environment variables (a `.env` file in the
project root is loaded automatically by Bun).

| Variable | Required | Description |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes | API key for OpenRouter. |
| `OPENROUTER_DEFAULT_MODEL` | Yes | Model id to use, e.g. `anthropic/claude-sonnet-4-6`. |
| `TELEGRAM_BOT_TOKEN` | Telegram mode | Bot token from [@BotFather](https://t.me/BotFather). |
| `TELEGRAM_OWNER_ID` | Telegram mode | Your numeric Telegram user id — the only account allowed to use the bot. |
| `FIRECRAWL_API_KEY` | No | Enables web search/scrape tools when present. |

Example `.env`:

```bash
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_DEFAULT_MODEL=anthropic/claude-sonnet-4-6
TELEGRAM_BOT_TOKEN=123456789:AA...
TELEGRAM_OWNER_ID=123456789
# FIRECRAWL_API_KEY=fc-...
```

> **Finding your `TELEGRAM_OWNER_ID`:** message your bot once, then read
> `result[].message.from.id` from
> `https://api.telegram.org/bot<TOKEN>/getUpdates`, or message
> [@userinfobot](https://t.me/userinfobot). It must be **your** user id, not the
> bot's id.

## Usage

Run the interactive launcher:

```bash
bun run index.ts wakeup
```

You'll see a banner and a prompt to choose a mode:

- **CLI** — pick Agent / Plan / Ask and work in the terminal.
- **Telegram** — start the bot; it sends you a welcome message and listens for
  commands.

If the `bin` is linked (e.g. `bun link` or after install), you can also run:

```bash
clawkit wakeup
```

### Telegram commands

Once the bot is running, message it (only the configured owner is allowed):

- `/ask <question>` — ask about the codebase (read-only).
- `/plan <goal>` — generate a plan; tap steps to toggle, then **Proceed**.
- `/agent <task>` — let the agent work on a task; review and approve changes.

## How it works

clawkit runs in whatever directory you launch it from — the current working
directory is treated as the workspace root (`codebasePath`). The agent can read
files, list/search the tree, and analyze the codebase. Mutating actions
(create / modify / delete files, run shell commands) are **staged** into an
action tracker and presented for approval; only approved actions are applied.
Paths like `node_modules`, `.git`, `dist`, `build`, and `.env*` are excluded by
default.

## Project structure

```
index.ts              CLI entrypoint (commander)
ai/                   OpenRouter model configuration
modes/
  cli.ts              CLI sub-mode menu
  agent/              Agent orchestration, tools, approval, diff view
  ask/                Read-only Q&A orchestration
  plan/               Plan generation, selection, web tools
  telegram/           Telegram bot: handlers, sessions, auth, text helpers
tui/                  Terminal banner and markdown rendering
```

## License

MIT — see below.

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
