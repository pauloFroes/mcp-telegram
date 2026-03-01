# <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" width="28" /> mcp-telegram

MCP server that wraps the [Telegram Bot API](https://core.telegram.org/bots/api) as semantic tools for LLM agents — with **multi-bot support** for managing multiple agent conversations.

Works with **Claude Code**, **Codex**, **Claude Desktop**, **Cursor**, **VS Code**, **Windsurf**, and any MCP-compatible client.

## Prerequisites

- **Node.js 18+**
- One or more Telegram bot tokens (create via [@BotFather](https://t.me/BotFather))
- Your Telegram chat ID

| Variable | Description | Where to find |
|---|---|---|
| `TELEGRAM_BOT_<NAME>` | Bot token (one per agent) | [@BotFather](https://t.me/BotFather) → `/newbot` |
| `TELEGRAM_CHAT_ID` | Your Telegram user/chat ID | Send `/start` to your bot, then call `getUpdates` |

> **Multi-bot convention**: Each `TELEGRAM_BOT_<NAME>` env var registers a bot. The `<NAME>` becomes the bot identifier used in tools (e.g., `TELEGRAM_BOT_VENDAS` → `bot: "vendas"`).

## Installation

### Claude Code

```bash
claude mcp add telegram \
  -s local \
  -e TELEGRAM_BOT_VENDAS=your-token \
  -e TELEGRAM_CHAT_ID=your-chat-id \
  -- npx -y github:pauloFroes/mcp-telegram
```

### Codex

Add to your `codex.toml`:

```toml
[mcp.telegram]
transport = "stdio"
command = "npx"
args = ["-y", "github:pauloFroes/mcp-telegram"]

[mcp.telegram.env]
TELEGRAM_BOT_VENDAS = "your-token"
TELEGRAM_CHAT_ID = "your-chat-id"
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "telegram": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-telegram"],
      "env": {
        "TELEGRAM_BOT_VENDAS": "your-token",
        "TELEGRAM_CHAT_ID": "your-chat-id"
      }
    }
  }
}
```

### Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "telegram": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-telegram"],
      "env": {
        "TELEGRAM_BOT_VENDAS": "your-token",
        "TELEGRAM_CHAT_ID": "your-chat-id"
      }
    }
  }
}
```

### VS Code

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "telegram": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-telegram"],
      "env": {
        "TELEGRAM_BOT_VENDAS": "your-token",
        "TELEGRAM_CHAT_ID": "your-chat-id"
      }
    }
  }
}
```

### Windsurf

Add to your `~/.windsurf/mcp.json`:

```json
{
  "mcpServers": {
    "telegram": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-telegram"],
      "env": {
        "TELEGRAM_BOT_VENDAS": "your-token",
        "TELEGRAM_CHAT_ID": "your-chat-id"
      }
    }
  }
}
```

## Available Tools

### Messaging

| Tool | Description | Key Parameters |
|---|---|---|
| `send_message` | Send a text message (supports Markdown/HTML) | `text`, `bot?`, `parse_mode?` |
| `send_photo` | Send a photo by URL or file_id | `photo`, `bot?`, `caption?` |
| `send_document` | Send a document/file by URL or file_id | `document`, `bot?`, `caption?` |

### Updates & Management

| Tool | Description | Key Parameters |
|---|---|---|
| `get_updates` | Get recent incoming messages for a bot | `bot?`, `limit?`, `offset?` |
| `list_bots` | List all configured bots with their Telegram info | — |

## Use Cases & Examples

- **"Send today's sales summary via the vendas bot"** — Collects data from other MCPs, formats a report, sends via `send_message` with `bot: "vendas"`
- **"Alert me on Telegram if ad spend exceeds R$500"** — Checks Meta Ads data, sends alert via `send_message` with `bot: "ads"`
- **"Check if Paulo replied to the last notification"** — Calls `get_updates` on the relevant bot to read recent messages
- **"Send this chart to my Telegram"** — Uses `send_photo` with the image URL

## Authentication

Bot tokens are passed in the URL path per [Telegram Bot API convention](https://core.telegram.org/bots/api#authorizing-your-bot). No OAuth flow required — each bot token is self-contained.

## License

MIT
