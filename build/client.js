import { BASE_URL, getBot } from "./auth.js";
export class TelegramApiError extends Error {
    status;
    errorCode;
    constructor(status, errorCode, message) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.name = "TelegramApiError";
    }
}
export async function apiRequest(method, botName, body, queryParams) {
    const bot = getBot(botName);
    let url = `${BASE_URL}/bot${bot.token}/${method}`;
    if (queryParams) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined && value !== "") {
                params.set(key, value);
            }
        }
        const qs = params.toString();
        if (qs)
            url += `?${qs}`;
    }
    const response = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = (await response.json());
    if (!data.ok) {
        if (response.status === 429) {
            throw new TelegramApiError(429, data.error_code ?? 429, "Telegram rate limit exceeded. Try again in a moment.");
        }
        throw new TelegramApiError(response.status, data.error_code ?? response.status, `Telegram API error (${data.error_code}): ${data.description ?? response.statusText}`);
    }
    return data.result;
}
export function toolResult(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
export function toolError(message) {
    return {
        isError: true,
        content: [{ type: "text", text: message }],
    };
}
