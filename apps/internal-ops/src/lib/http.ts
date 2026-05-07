import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public extra?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export function json<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(
  status: number,
  message: string,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function jsonValidationError(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      error: "Invalid request body",
      issues: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
        code: i.code,
      })),
    },
    { status: 422 },
  );
}

export async function readJson<T = unknown>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    // 422 (not 400) — packet acceptance gate says malformed bodies reject with
    // 422; Zod validation errors and JSON parse errors both surface as 422 so
    // consumers can treat "request body invalid" as one class.
    throw new HttpError(422, "Invalid JSON body");
  }
}

export function handleError(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return jsonError(err.status, err.message, err.extra);
  }
  if (err instanceof ZodError) {
    return jsonValidationError(err);
  }
  console.error("[internal-ops] unhandled route error", err);
  return jsonError(500, "Internal server error");
}
