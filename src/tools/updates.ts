import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, toolResult, toolError } from "../client.js";
import { listBots } from "../auth.js";

export function registerUpdateTools(server: McpServer) {
  server.registerTool(
    "get_updates",
    {
      title: "Get Telegram Updates",
      description:
        "Get recent incoming messages/updates for a bot. Uses short polling. " +
        "Returns the last N messages received by the bot.",
      inputSchema: {
        bot: z
          .string()
          .optional()
          .describe("Bot name to get updates from. Omit for default."),
        limit: z
          .number()
          .min(1)
          .max(100)
          .optional()
          .describe("Max number of updates to retrieve (1-100, default: 20)."),
        offset: z
          .number()
          .optional()
          .describe(
            "Update offset. Pass last update_id + 1 to get only new updates.",
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ bot, limit, offset }) => {
      try {
        const queryParams: Record<string, string | undefined> = {
          limit: (limit ?? 20).toString(),
          timeout: "0",
        };
        if (offset !== undefined) queryParams.offset = offset.toString();

        const data = await apiRequest(
          "getUpdates",
          bot,
          undefined,
          queryParams,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(
          `Failed to get updates: ${(error as Error).message}`,
        );
      }
    },
  );

  server.registerTool(
    "list_bots",
    {
      title: "List Configured Bots",
      description:
        "List all configured Telegram bots and their names. " +
        "Use this to discover available bot identifiers for the 'bot' parameter.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const bots = listBots();
        const results = await Promise.all(
          bots.map(async (b) => {
            try {
              const me = await apiRequest<{
                id: number;
                first_name: string;
                username: string;
              }>("getMe", b.name);
              return {
                name: b.name,
                telegram_id: me.id,
                display_name: me.first_name,
                username: me.username,
              };
            } catch {
              return {
                name: b.name,
                error: "Failed to connect to this bot",
              };
            }
          }),
        );
        return toolResult(results);
      } catch (error) {
        return toolError(
          `Failed to list bots: ${(error as Error).message}`,
        );
      }
    },
  );
}
