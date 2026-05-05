"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "ok" | "error";

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Submission failed");
      }
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center">
        <div className="mx-auto inline-flex items-center justify-center size-12 rounded-full bg-success/10 text-success">
          <Check className="size-6" strokeWidth={2.25} />
        </div>
        <h3 className="mt-5 font-semibold text-xl tracking-tight">
          Got it. We'll be in touch within one business day.
        </h3>
        <p className="mt-3 text-[0.95rem] text-muted-foreground leading-relaxed max-w-md mx-auto">
          Expect a real reply from a real person. We read every intake — usually
          within a few hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-accent hover:text-accent-hover font-medium"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-white p-6 sm:p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@yourbusiness.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="business">Business name</Label>
          <Input
            id="business"
            name="business"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your Business, LLC"
          />
        </div>
        <div>
          <Label htmlFor="businessType">What kind of business?</Label>
          <Input
            id="businessType"
            name="businessType"
            type="text"
            required
            placeholder="e.g. car wash, agency, e-commerce"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="problems">What's slowing you down right now?</Label>
        <Textarea
          id="problems"
          name="problems"
          required
          rows={4}
          placeholder="The friction you can feel but can't quite name. Operational drag, manual rework, missed revenue — write it like you'd describe it to a friend."
        />
      </div>

      <div>
        <Label htmlFor="tools">What tools are you using today?</Label>
        <Textarea
          id="tools"
          name="tools"
          rows={2}
          placeholder="e.g. Square + Google Sheets + email. Anything you can think of, even the ones you'd rather not."
        />
      </div>

      <div>
        <Label htmlFor="outcome">What would 'fixed' look like?</Label>
        <Textarea
          id="outcome"
          name="outcome"
          rows={2}
          placeholder="Describe the version of your business where this isn't a problem anymore."
        />
      </div>

      <div>
        <Label htmlFor="tier" className="block mb-2">
          Which tier interests you?
        </Label>
        <select
          id="tier"
          name="tier"
          defaultValue="audit"
          className={cn(
            "h-11 w-full rounded-md border border-border bg-white px-3.5 text-[0.95rem] text-foreground",
            "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-colors",
          )}
        >
          <option value="audit">Business System Audit (start here)</option>
          <option value="build">Custom Software Build</option>
          <option value="support">Monthly Support</option>
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">
          We read every submission. Typical response: within one business day.
        </p>
        <Button
          type="submit"
          size="md"
          disabled={status === "submitting"}
          className="sm:w-auto"
        >
          {status === "submitting" ? "Sending…" : "Book the audit"}
          {status !== "submitting" && <ArrowRight className="size-4" />}
        </Button>
      </div>

      {status === "error" && (
        <p className="text-sm text-error">
          {errorMessage}. You can also email{" "}
          <a href="mailto:hello@conscienceos.com" className="underline">
            hello@conscienceos.com
          </a>{" "}
          directly.
        </p>
      )}
    </form>
  );
}
