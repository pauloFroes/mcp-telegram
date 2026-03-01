export interface BotConfig {
    name: string;
    token: string;
}
export declare const CHAT_ID: string;
export declare function getBot(name?: string): BotConfig;
export declare function listBots(): BotConfig[];
export declare const BASE_URL = "https://api.telegram.org";
