import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  index,
  jsonb,
  integer,
  inet,
  check,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// Enums (additive: existing 'tier' + 'status' remain; new enums layered on top)
// ─────────────────────────────────────────────────────────────────────────────

// Existing enums from 0000_init.sql (do not modify; keep for backward-compat)
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
  // Internal-ops pipeline values added via ALTER TYPE in 0001:
  "new_lead",
  "audit_scheduled",
  "audit_completed",
  "proposal_sent",
  "on_hold",
]);

// New enums for internal-ops domain entities
export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "paused",
  "offboarded",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "discovery",
  "planning",
  "building",
  "review",
  "deployed",
  "support",
  "complete",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "to_do",
  "in_progress",
  "waiting",
  "done",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "audit",
  "call",
  "deadline",
  "follow_up",
  "other",
]);

export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "operator",
  "client",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Leads (extended additively from 0000_init)
// Original columns: business, business_type, status, tier, next_action,
// next_action_at — kept as legacy. New columns added strictly via 0001 migration.
// ─────────────────────────────────────────────────────────────────────────────

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    // Legacy column kept for backward compat with existing /api/lead writes
    business: text("business").notNull(),
    // New canonical column for internal-ops (mirror of business until cleanup migration)
    businessName: text("business_name"),
    phone: text("phone"),
    businessType: text("business_type").notNull(),
    problems: text("problems").notNull(),
    tools: text("tools").notNull().default(""),
    outcome: text("outcome").notNull().default(""),
    tier: tierEnum("tier").notNull().default("audit"),
    status: statusEnum("status").notNull().default("new"),
    source: text("source").notNull().default("website"),
    notes: text("notes"),
    // Legacy field kept (some old data may have used it for "next thing to do")
    nextAction: text("next_action"),
    nextActionAt: timestamp("next_action_at", { withTimezone: true }),
    // New canonical field for follow-up scheduling
    nextFollowUpAt: timestamp("next_follow_up_at", { withTimezone: true }),
    // Set when a lead converts to a client (via Won transition)
    convertedClientId: uuid("converted_client_id"),
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
    index("idx_leads_next_follow_up_at").on(t.nextFollowUpAt),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Lead notes (existing, unchanged)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Clients
// ─────────────────────────────────────────────────────────────────────────────

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessName: text("business_name").notNull(),
    contactName: text("contact_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    status: clientStatusEnum("status").notNull().default("active"),
    notes: text("notes"),
    importantLinks: jsonb("important_links")
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_clients_status").on(t.status),
    index("idx_clients_business_name").on(t.businessName),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("discovery"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    deliverables: jsonb("deliverables")
      .notNull()
      .default(sql`'[]'::jsonb`),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_projects_client_id").on(t.clientId),
    index("idx_projects_status").on(t.status),
    index("idx_projects_due_date").on(t.dueDate),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────────────────────

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("to_do"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    leadId: uuid("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_tasks_status").on(t.status),
    index("idx_tasks_priority").on(t.priority),
    index("idx_tasks_due_date").on(t.dueDate),
    index("idx_tasks_client_id").on(t.clientId),
    index("idx_tasks_project_id").on(t.projectId),
    index("idx_tasks_lead_id").on(t.leadId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Events (calendar items: audits, calls, deadlines, follow-ups)
// ─────────────────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    type: eventTypeEnum("type").notNull().default("other"),
    dateTime: timestamp("date_time", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(30),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    leadId: uuid("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_events_date_time").on(t.dateTime),
    index("idx_events_type").on(t.type),
    index("idx_events_client_id").on(t.clientId),
    index("idx_events_lead_id").on(t.leadId),
    index("idx_events_project_id").on(t.projectId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Audits (structured System Audit captures)
// CHECK constraint: every audit must attach to a lead OR a client.
// ─────────────────────────────────────────────────────────────────────────────

export const audits = pgTable(
  "audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").references(() => leads.id, {
      onDelete: "set null",
    }),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    businessOverview: text("business_overview"),
    currentTools: text("current_tools"),
    painPoints: text("pain_points"),
    opportunities: text("opportunities"),
    recommendedSystems: text("recommended_systems"),
    nextSteps: text("next_steps"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "audits_attach_to_lead_or_client",
      sql`${t.leadId} IS NOT NULL OR ${t.clientId} IS NOT NULL`,
    ),
    index("idx_audits_lead_id").on(t.leadId),
    index("idx_audits_client_id").on(t.clientId),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Users (multi-user from day 1, seeded with one owner row at first deploy)
// ─────────────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("operator"),
    name: text("name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_users_email_lower").on(sql`LOWER(${t.email})`),
    index("idx_users_role").on(t.role),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Sessions (server-side session record so we can revoke without rotating JWT_SECRET)
// jti = JWT ID, used to look up + revoke individual tokens
// ─────────────────────────────────────────────────────────────────────────────

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jti: text("jti").notNull(),
    ip: inet("ip"),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("idx_sessions_jti").on(t.jti),
    index("idx_sessions_user_id").on(t.userId),
    index("idx_sessions_expires_at").on(t.expiresAt),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Invitations (Phase 4 prep — the schema is in place, the UI flow ships later)
// ─────────────────────────────────────────────────────────────────────────────

export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    role: userRoleEnum("role").notNull().default("operator"),
    tokenHash: text("token_hash").notNull(),
    invitedBy: uuid("invited_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_invitations_email").on(sql`LOWER(${t.email})`),
    index("idx_invitations_token_hash").on(t.tokenHash),
    index("idx_invitations_expires_at").on(t.expiresAt),
  ],
);

// ─────────────────────────────────────────────────────────────────────────────
// Type exports
// ─────────────────────────────────────────────────────────────────────────────

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
export type NewLeadNote = typeof leadNotes.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type LeadStatus = (typeof statusEnum.enumValues)[number];
export type LeadTier = (typeof tierEnum.enumValues)[number];
export type ClientStatus = (typeof clientStatusEnum.enumValues)[number];
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];
export type EventType = (typeof eventTypeEnum.enumValues)[number];
export type UserRole = (typeof userRoleEnum.enumValues)[number];

// Internal-ops canonical lead status values (the 8-state pipeline)
// face-f's UI uses ONLY these; the 7 legacy values exist in the enum but are
// treated as "new_lead" equivalent or "archived" in practice.
export const INTERNAL_OPS_LEAD_STATUSES = [
  "new_lead",
  "contacted",
  "audit_scheduled",
  "audit_completed",
  "proposal_sent",
  "won",
  "lost",
  "on_hold",
] as const satisfies readonly LeadStatus[];

export type InternalOpsLeadStatus = (typeof INTERNAL_OPS_LEAD_STATUSES)[number];
