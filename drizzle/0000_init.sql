CREATE TYPE "public"."status" AS ENUM('new', 'contacted', 'qualified', 'in_audit', 'won', 'lost', 'archived');--> statement-breakpoint
CREATE TYPE "public"."tier" AS ENUM('audit', 'build', 'support', 'not-sure');--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"body" text NOT NULL,
	"author" text DEFAULT 'Operator' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"business" text NOT NULL,
	"business_type" text NOT NULL,
	"problems" text NOT NULL,
	"tools" text DEFAULT '' NOT NULL,
	"outcome" text DEFAULT '' NOT NULL,
	"tier" "tier" DEFAULT 'audit' NOT NULL,
	"status" "status" DEFAULT 'new' NOT NULL,
	"source" text DEFAULT 'website' NOT NULL,
	"next_action" text,
	"next_action_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_lead_notes_lead_id" ON "lead_notes" USING btree ("lead_id","created_at" desc);--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at" desc);