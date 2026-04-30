import { Request, Response } from "express";

/** 
 * Sends a standardized error response.
 * 
 * The response JSON includes:
 * - `result`: The HTTP status code.
 * - `errorMsg`: The provided error message.
 * - `timestamp`: ISO timestamp of when the error occurred.
 * - `queryParams`: The query parameters from the request for debugging.
 */
export function sendError(request: Request, response: Response, statusCode: number, errorMsg: string) {
  response.status(statusCode).json({
    result: statusCode,
    errorMsg: errorMsg,
    timestamp: new Date().toISOString(),
    queryParams: request.query,
  });
}

/**
 * Sends a standardized success response.
 *
 * The response JSON includes:
 * - `result`: The string "success".
 * - `data`: The provided data.
 */
export function sendSuccess(request: Request, response: Response, data: any) {
  response.status(200).json({
    result: "success",
    data: data
  });
}
