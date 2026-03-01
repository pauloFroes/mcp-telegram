#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerMessagingTools } from "./tools/messaging.js";
import { registerUpdateTools } from "./tools/updates.js";
const server = new McpServer({
    name: "mcp-telegram",
    version: "1.0.0",
});
registerMessagingTools(server);
registerUpdateTools(server);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("mcp-telegram server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
