import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const leadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  business: z.string().min(1).max(160),
  businessType: z.string().min(1).max(160),
  problems: z.string().min(1).max(4000),
  tools: z.string().max(2000).optional().default(""),
  outcome: z.string().max(4000).optional().default(""),
  tier: z.enum(["audit", "build", "support", "not-sure"]).default("audit"),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const lead = parsed.data;

  const submittedAt = new Date().toISOString();
  const summary = formatLead(lead, submittedAt);

  console.log("[lead]", summary);

  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.LEAD_INBOX || "hello@conscienceos.com";
  const fromAddress =
    process.env.LEAD_FROM || "Conscience OS <onboarding@resend.dev>";

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: fromAddress,
        to: inbox,
        replyTo: lead.email,
        subject: `New lead — ${lead.business} (${lead.tier})`,
        text: summary,
      });
    } catch (err) {
      console.error("[lead] resend error", err);
    }
  }

  const discord = process.env.LEAD_DISCORD_WEBHOOK;
  if (discord) {
    try {
      await fetch(discord, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Lead",
          content: `**New lead — ${lead.business}** (${lead.tier})\nFrom: ${lead.name} <${lead.email}>\n\n${truncate(summary, 1500)}`,
        }),
      });
    } catch (err) {
      console.error("[lead] discord error", err);
    }
  }

  return NextResponse.json({ ok: true });
}

function formatLead(lead: z.infer<typeof leadSchema>, ts: string) {
  return [
    `Submitted: ${ts}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Business: ${lead.business}`,
    `Business type: ${lead.businessType}`,
    `Tier interest: ${lead.tier}`,
    "",
    "What's slowing them down:",
    lead.problems,
    "",
    "Tools in use:",
    lead.tools || "(not provided)",
    "",
    "What 'fixed' looks like:",
    lead.outcome || "(not provided)",
  ].join("\n");
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
