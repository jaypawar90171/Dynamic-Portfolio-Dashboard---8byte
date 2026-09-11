import type { NextFunction, Request, Response } from "express";
export declare class HttpError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare class NotFoundError extends HttpError {
    constructor(resource?: string);
}
export declare class ValidationError extends HttpError {
    constructor(message: string);
}
export declare class ExternalServiceError extends HttpError {
    constructor(service: string, message?: string);
}
export declare function notFound(_req: Request, res: Response): void;
export declare function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map