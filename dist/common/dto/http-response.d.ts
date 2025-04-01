export declare class HttpResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    constructor(success: boolean, message: string, data?: T, errors?: Record<string, string[]>);
    static success<T>(data?: T, message?: string): HttpResponse<T>;
    static error<T>(message?: string, errors?: Record<string, string[]>, data?: T): HttpResponse<T>;
}
