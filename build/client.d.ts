export declare class TelegramApiError extends Error {
    status: number;
    errorCode: number;
    constructor(status: number, errorCode: number, message: string);
}
export declare function apiRequest<T>(method: string, botName?: string, body?: Record<string, unknown>, queryParams?: Record<string, string | undefined>): Promise<T>;
export declare function toolResult(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function toolError(message: string): {
    isError: true;
    content: {
        type: "text";
        text: string;
    }[];
};
