export interface BotConfig {
  name: string;
  token: string;
}

const BOT_PREFIX = "TELEGRAM_BOT_";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Error: Missing required environment variable: ${name}\n` +
        "  TELEGRAM_CHAT_ID and at least one TELEGRAM_BOT_<NAME> are required.\n" +
        "  Create bots via @BotFather on Telegram: https://t.me/BotFather",
    );
    process.exit(1);
  }
  return value;
}

export const CHAT_ID = getRequiredEnv("TELEGRAM_CHAT_ID");

const botRegistry = new Map<string, BotConfig>();
let defaultBotName: string | null = null;

for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith(BOT_PREFIX) && value) {
    const name = key.slice(BOT_PREFIX.length).toLowerCase();
    botRegistry.set(name, { name, token: value });
    if (!defaultBotName) defaultBotName = name;
  }
}

if (botRegistry.size === 0) {
  console.error(
    "Error: No Telegram bot tokens found.\n" +
      "  Set at least one TELEGRAM_BOT_<NAME>=<token> environment variable.\n" +
      "  Example: TELEGRAM_BOT_VENDAS=1234567890:ABCdefGHI...",
  );
  process.exit(1);
}

console.error(`Telegram bots loaded: ${[...botRegistry.keys()].join(", ")}`);

export function getBot(name?: string): BotConfig {
  if (!name) return botRegistry.get(defaultBotName!)!;
  const bot = botRegistry.get(name.toLowerCase());
  if (!bot) {
    const available = [...botRegistry.keys()].join(", ");
    throw new Error(`Bot "${name}" not found. Available bots: ${available}`);
  }
  return bot;
}

export function listBots(): BotConfig[] {
  return [...botRegistry.values()];
}

export const BASE_URL = "https://api.telegram.org";
