import { BASE_URL, getBot } from "./auth.js";

export class TelegramApiError extends Error {
  constructor(
    public status: number,
    public errorCode: number,
    message: string,
  ) {
    super(message);
    this.name = "TelegramApiError";
  }
}

interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export async function apiRequest<T>(
  method: string,
  botName?: string,
  body?: Record<string, unknown>,
  queryParams?: Record<string, string | undefined>,
): Promise<T> {
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
    if (qs) url += `?${qs}`;
  }

  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as TelegramResponse<T>;

  if (!data.ok) {
    if (response.status === 429) {
      throw new TelegramApiError(
        429,
        data.error_code ?? 429,
        "Telegram rate limit exceeded. Try again in a moment.",
      );
    }
    throw new TelegramApiError(
      response.status,
      data.error_code ?? response.status,
      `Telegram API error (${data.error_code}): ${data.description ?? response.statusText}`,
    );
  }

  return data.result as T;
}

export function toolResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function toolError(message: string) {
  return {
    isError: true as const,
    content: [{ type: "text" as const, text: message }],
  };
}
