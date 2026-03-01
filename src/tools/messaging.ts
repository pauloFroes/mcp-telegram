import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
import { CHAT_ID } from "../auth.js";

export function registerMessagingTools(server: McpServer) {
  server.registerTool(
    "send_message",
    {
      title: "Send Telegram Message",
      description:
        "Send a text message via a Telegram bot. Supports Markdown and HTML formatting. " +
        "If chat_id is omitted, sends to the default chat (Paulo).",
      inputSchema: {
        text: z
          .string()
          .min(1)
          .describe(
            "Message text content. Supports Markdown or HTML based on parse_mode.",
          ),
        bot: z
          .string()
          .optional()
          .describe(
            "Bot name to send from (e.g. 'vendas', 'ads'). Omit for default bot.",
          ),
        chat_id: z
          .string()
          .optional()
          .describe(
            "Telegram chat ID to send to. Omit to use the default TELEGRAM_CHAT_ID.",
          ),
        parse_mode: z
          .enum(["MarkdownV2", "HTML"])
          .optional()
          .describe(
            "Message formatting: 'MarkdownV2' or 'HTML'. Omit for plain text.",
          ),
        disable_notification: z
          .boolean()
          .optional()
          .describe("Send silently without notification sound."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ text, bot, chat_id, parse_mode, disable_notification }) => {
      try {
        const body: Record<string, unknown> = {
          chat_id: chat_id ?? CHAT_ID,
          text,
        };
        if (parse_mode) body.parse_mode = parse_mode;
        if (disable_notification !== undefined)
          body.disable_notification = disable_notification;

        const data = await apiRequest("sendMessage", bot, body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to send message: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "send_photo",
    {
      title: "Send Telegram Photo",
      description:
        "Send a photo via a Telegram bot. Photo must be a publicly accessible URL or a Telegram file_id.",
      inputSchema: {
        photo: z
          .string()
          .describe("Photo URL (publicly accessible) or Telegram file_id."),
        bot: z
          .string()
          .optional()
          .describe("Bot name to send from. Omit for default bot."),
        chat_id: z
          .string()
          .optional()
          .describe("Chat ID. Omit for default."),
        caption: z.string().optional().describe("Photo caption text."),
        parse_mode: z
          .enum(["MarkdownV2", "HTML"])
          .optional()
          .describe("Caption formatting."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ photo, bot, chat_id, caption, parse_mode }) => {
      try {
        const body: Record<string, unknown> = {
          chat_id: chat_id ?? CHAT_ID,
          photo,
        };
        if (caption) body.caption = caption;
        if (parse_mode) body.parse_mode = parse_mode;

        const data = await apiRequest("sendPhoto", bot, body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to send photo: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "send_document",
    {
      title: "Send Telegram Document",
      description:
        "Send a document/file via a Telegram bot. Document must be a publicly accessible URL or a Telegram file_id.",
      inputSchema: {
        document: z
          .string()
          .describe(
            "Document URL (publicly accessible) or Telegram file_id.",
          ),
        bot: z
          .string()
          .optional()
          .describe("Bot name to send from. Omit for default bot."),
        chat_id: z
          .string()
          .optional()
          .describe("Chat ID. Omit for default."),
        caption: z.string().optional().describe("Document caption text."),
        parse_mode: z
          .enum(["MarkdownV2", "HTML"])
          .optional()
          .describe("Caption formatting."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ document, bot, chat_id, caption, parse_mode }) => {
      try {
        const body: Record<string, unknown> = {
          chat_id: chat_id ?? CHAT_ID,
          document,
        };
        if (caption) body.caption = caption;
        if (parse_mode) body.parse_mode = parse_mode;

        const data = await apiRequest("sendDocument", bot, body);
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to send document: ${(error as Error).message}`,
        );
      }
    },
  );
}
