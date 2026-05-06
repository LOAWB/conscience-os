import { NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie, signSession, verifyCredentials } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const ok = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!ok) {
    // Delay to mitigate timing attacks
    await new Promise((r) => setTimeout(r, 250));
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = await signSession(parsed.data.email);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
