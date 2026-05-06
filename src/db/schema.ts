import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tierEnum = pgEnum("tier", [
  "audit",
  "build",
  "support",
  "not-sure",
]);

export const statusEnum = pgEnum("status", [
  "new",
  "contacted",
  "qualified",
  "in_audit",
  "won",
  "lost",
  "archived",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    business: text("business").notNull(),
    businessType: text("business_type").notNull(),
    problems: text("problems").notNull(),
    tools: text("tools").notNull().default(""),
    outcome: text("outcome").notNull().default(""),
    tier: tierEnum("tier").notNull().default("audit"),
    status: statusEnum("status").notNull().default("new"),
    source: text("source").notNull().default("website"),
    nextAction: text("next_action"),
    nextActionAt: timestamp("next_action_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_leads_status").on(t.status),
    index("idx_leads_created_at").on(sql`${t.createdAt} desc`),
  ],
);

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    author: text("author").notNull().default("Operator"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_lead_notes_lead_id").on(t.leadId, sql`${t.createdAt} desc`),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadStatus = (typeof statusEnum.enumValues)[number];
export type LeadTier = (typeof tierEnum.enumValues)[number];
export type LeadNote = typeof leadNotes.$inferSelect;
