import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getDb, isDbConnected, leads } from "@repo/db";

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

type Lead = z.infer<typeof leadSchema>;

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
  const summary = formatLeadSummary(lead, submittedAt);

  console.log("[lead]", summary);

  // Persist to DB if configured
  if (isDbConnected()) {
    try {
      const db = getDb();
      await db.insert(leads).values({
        name: lead.name,
        email: lead.email,
        // Legacy column (kept NOT NULL) + new canonical column written together
        // until a future cleanup migration drops the legacy field.
        business: lead.business,
        businessName: lead.business,
        businessType: lead.businessType,
        problems: lead.problems,
        tools: lead.tools,
        outcome: lead.outcome,
        tier: lead.tier,
        source: "website",
      });
    } catch (err) {
      console.error("[lead] db insert error", err);
      // Don't fail the request — email still goes out, intake still captured in logs
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.LEAD_INBOX || "hello@conscienceos.com";
  const fromAddress =
    process.env.LEAD_FROM || "Conscience Os <onboarding@resend.dev>";

  if (apiKey) {
    const resend = new Resend(apiKey);

    try {
      await resend.emails.send({
        from: fromAddress,
        to: inbox,
        replyTo: lead.email,
        subject: `New lead — ${lead.business} (${lead.tier})`,
        text: summary,
      });
    } catch (err) {
      console.error("[lead] internal email error", err);
    }

    try {
      await resend.emails.send({
        from: fromAddress,
        to: lead.email,
        replyTo: inbox,
        subject: "We got your audit request",
        text: confirmationEmailText(lead),
      });
    } catch (err) {
      console.error("[lead] confirmation email error", err);
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

function formatLeadSummary(lead: Lead, ts: string) {
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

function confirmationEmailText(lead: Lead) {
  const firstName = lead.name.split(" ")[0] || lead.name;
  return [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out. We read every intake personally — you'll hear back from us within one business day with next steps.",
    "",
    "What happens next:",
    "  1. We review what you sent.",
    "  2. You get a real reply from a real person (no auto-responder loop).",
    "  3. We schedule a 60-minute kickoff call to walk through the audit.",
    "",
    "A few things you might be wondering about:",
    "  · Every engagement starts with a System Audit",
    "  · Each engagement is custom, scoped to your business",
    "  · Audit findings are yours — build with anyone you like",
    "",
    "If you need to add anything or have a quick question, just reply to this email. It goes to the same inbox we read.",
    "",
    "— Conscience Os",
    "  hello@conscienceos.com",
  ].join("\n");
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
