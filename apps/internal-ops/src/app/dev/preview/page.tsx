/**
 * Dev-only primitive preview. Renders every @repo/ui export so face-e can
 * sanity-check visuals without booting the full dashboard.
 *
 * SECURITY (per A5 amendment):
 *   - Runtime gate: returns 404 when NODE_ENV !== "development"
 *   - Middleware-level: this route lives under the auth-gated tree by default
 *     (NOT added to PUBLIC_PATHS). Two lines of defense.
 */
import { notFound } from "next/navigation";
import { PreviewModalToggle } from "./_preview-modal-toggle";
import {
  ActionBar,
  AuraGlow,
  Avatar,
  Button,
  Checklist,
  ConfirmDialog,
  CountStrip,
  DataList,
  DateTimePicker,
  DetailField,
  DetailPanel,
  Drawer,
  DropdownMenu,
  EntityDetailLoading,
  EntityEmptyState,
  EntityListLoading,
  ErrorBoundaryFallback,
  FilterTabs,
  FormError,
  FormField,
  GlassCard,
  IconBox,
  IconButton,
  InlineNotice,
  LinkButton,
  Modal,
  NoteComposer,
  PageHeader,
  Pagination,
  PriorityChip,
  ProgressBar,
  SearchInput,
  SectionHeader,
  Select,
  StatusBadge,
  SwitchInput,
  Tabs,
  Tag,
  TextArea,
  TextInput,
  Timeline,
  TodayPanel,
  Wordmark,
} from "@repo/ui";

export const dynamic = "force-static";
export const revalidate = false;

export default function PreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main className="relative min-h-screen px-6 py-10">
      <AuraGlow position="top-right" size={500} intensity={0.12} />
      <div className="relative max-w-5xl mx-auto flex flex-col gap-10">
        <PageHeader
          eyebrow="dev preview · NODE_ENV=development only"
          title="@repo/ui primitive preview"
          description="Every published export rendered for visual sanity check. Returns 404 in production."
          actions={
            <Button variant="secondary" size="sm">
              No-op
            </Button>
          }
        />

        <Section title="Buttons & link buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="ink">Ink</Button>
            <Button variant="destructive">Destructive</Button>
            <LinkButton href="#" variant="primary" size="sm">
              Link button
            </LinkButton>
            <IconButton label="Search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </IconButton>
          </div>
        </Section>

        <Section title="Wordmark + brand surfaces">
          <div className="flex flex-wrap gap-4 items-center">
            <Wordmark />
            <IconBox size="md">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </IconBox>
            <Avatar name="Jared Garcia" />
            <GlassCard aura className="p-4 text-sm">
              aura glass card
            </GlassCard>
            <GlassCard ink className="p-4 text-sm">
              ink card
            </GlassCard>
          </div>
        </Section>

        <Section title="Status badges + chips + tags">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge variant="lead" status="new_lead" />
            <StatusBadge variant="lead" status="audit_scheduled" />
            <StatusBadge variant="lead" status="proposal_sent" />
            <StatusBadge variant="lead" status="won" />
            <StatusBadge variant="lead" status="on_hold" />
            <StatusBadge variant="client" status="active" />
            <StatusBadge variant="project" status="building" />
            <StatusBadge variant="task" status="in_progress" />
            <PriorityChip level="low" />
            <PriorityChip level="medium" />
            <PriorityChip level="high" />
            <PriorityChip level="critical" />
            <Tag>website</Tag>
            <Tag tone="legacy">legacy</Tag>
            <Tag tone="demo">demo</Tag>
          </div>
        </Section>

        <Section title="Form primitives">
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
            <FormField label="Search" htmlFor="p-search">
              <SearchInput id="p-search" placeholder="Search clients…" />
            </FormField>
            <FormField label="Email" htmlFor="p-email" required>
              <TextInput
                id="p-email"
                type="email"
                placeholder="you@example.com"
              />
            </FormField>
            <FormField label="Notes" htmlFor="p-notes" hint="Markdown ok.">
              <TextArea id="p-notes" placeholder="Notes…" />
            </FormField>
            <FormField label="Status" htmlFor="p-select">
              <Select
                id="p-select"
                options={[
                  { value: "new_lead", label: "New" },
                  { value: "contacted", label: "Contacted" },
                  { value: "won", label: "Won" },
                ]}
              />
            </FormField>
            <FormField label="When" htmlFor="p-date">
              <DateTimePicker id="p-date" />
            </FormField>
            <FormField label="Auto follow-up">
              <SwitchInput
                checked={true}
                onChange={() => {}}
                label="Schedule a follow-up task"
              />
            </FormField>
          </div>
          <div className="mt-3">
            <FormError>Sample inline error.</FormError>
          </div>
        </Section>

        <Section title="List primitives">
          <FilterTabs
            value="all"
            onChange={() => {}}
            items={[
              { value: "all", label: "All", count: 12 },
              { value: "open", label: "Open", count: 7 },
              { value: "won", label: "Won", count: 3 },
            ]}
          />
          <DataList
            className="mt-4"
            items={[
              { id: "1", name: "Acme Logistics", status: "new_lead" as const },
              { id: "2", name: "Beta Foods", status: "contacted" as const },
              { id: "3", name: "Quanta Studio", status: "won" as const },
            ]}
            rowKey={(r) => r.id}
            onRowClick={() => {}}
            columns={[
              {
                id: "name",
                header: "Lead",
                cell: (r) => (
                  <span className="text-[var(--color-foreground)]">
                    {r.name}
                  </span>
                ),
              },
              {
                id: "status",
                header: "Status",
                width: "180px",
                cell: (r) => <StatusBadge variant="lead" status={r.status} />,
              },
              {
                id: "next",
                header: "",
                width: "60px",
                align: "right",
                cell: () => (
                  <span className="text-[var(--color-foreground)]/45">→</span>
                ),
              },
            ]}
          />
          <Pagination
            className="mt-3"
            page={1}
            pageSize={10}
            total={48}
            onChange={() => {}}
          />
        </Section>

        <Section title="Detail surfaces + tabs">
          <Tabs
            value="overview"
            onChange={() => {}}
            items={[
              { value: "overview", label: "Overview" },
              { value: "tasks", label: "Tasks", count: 3 },
              { value: "events", label: "Events", count: 1 },
            ]}
          />
          <DetailPanel className="mt-3 max-w-2xl">
            <DetailField label="Contact name">Jared Garcia</DetailField>
            <DetailField label="Email">jared@example.com</DetailField>
            <DetailField label="Status">
              <StatusBadge variant="lead" status="audit_scheduled" />
            </DetailField>
            <DetailField label="Next follow-up">2026-05-09 14:00</DetailField>
          </DetailPanel>
        </Section>

        <Section title="Data rendering">
          <ProgressBar value={64} max={100} />
          <Checklist
            className="mt-4"
            items={[
              { id: "a", label: "Discovery call notes", done: true },
              { id: "b", label: "Schema baseline migration", done: true },
              { id: "c", label: "Today shell + primitives", done: false },
              { id: "d", label: "Domain CRUD modules", done: false },
            ]}
            readOnly
          />
          <Timeline
            className="mt-4"
            items={[
              {
                id: "n3",
                at: "Tue 11:42",
                title: "Note added",
                by: "Jared",
                body: "Acme prefers mid-month invoicing.",
              },
              {
                id: "n2",
                at: "Mon 16:08",
                title: "Status → audit_scheduled",
                by: "Jared",
              },
              {
                id: "n1",
                at: "Mon 14:55",
                title: "Lead created",
                by: "intake",
                body: "Submitted via /book.",
              },
            ]}
          />
          <NoteComposer className="mt-4 max-w-md" onSubmit={async () => {}} />
        </Section>

        <Section title="States">
          <EntityListLoading rows={3} />
          <div className="mt-3">
            <EntityDetailLoading />
          </div>
          <div className="mt-3">
            <EntityEmptyState
              title="No leads yet"
              description="When the public site /book form fires, leads land here."
              action={<Button size="sm">Create manually</Button>}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" />
                </svg>
              }
            />
          </div>
          <div className="mt-3">
            <ErrorBoundaryFallback
              title="Preview only"
              description="ErrorBoundaryFallback rendered standalone for visual review."
              digest="DEV-PREVIEW-0001"
            />
          </div>
        </Section>

        <Section title="Notifications + overlays + dropdowns">
          <div className="flex flex-col gap-3 max-w-lg">
            <InlineNotice variant="info" title="Heads up">
              Generic info banner.
            </InlineNotice>
            <InlineNotice variant="warn">Warn variant.</InlineNotice>
            <InlineNotice variant="success">Saved.</InlineNotice>
            <InlineNotice variant="demo" title="Sample data">
              Demo banner — used on Today shell until /api/today wires.
            </InlineNotice>
          </div>
          <div className="mt-4">
            <DropdownMenu
              trigger={
                <Button variant="secondary" size="sm">
                  Open menu
                </Button>
              }
              items={[
                { label: "Edit", onSelect: () => {} },
                { label: "Duplicate", onSelect: () => {} },
                { type: "divider" },
                { label: "Delete", onSelect: () => {}, destructive: true },
              ]}
            />
          </div>
          <PreviewModalToggle />
        </Section>

        <Section title="Today composition">
          <CountStrip
            counts={[
              { label: "Open leads", value: 12 },
              { label: "Active clients", value: 4 },
              { label: "Active projects", value: 7, hint: "in flight" },
              { label: "Overdue tasks", value: 3, tone: "warn" },
            ]}
          />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <TodayPanel
              header={
                <SectionHeader title="Today's tasks" hint="3 open · demo" />
              }
            >
              <p className="text-sm text-[var(--color-foreground)]/55">
                List rendered in /(dashboard)/page.tsx · this is a shell
                preview.
              </p>
            </TodayPanel>
            <TodayPanel
              header={
                <SectionHeader title="Upcoming" hint="next 7 days · demo" />
              }
            >
              <p className="text-sm text-[var(--color-foreground)]/55">
                Schedule preview here.
              </p>
            </TodayPanel>
            <TodayPanel header={<SectionHeader title="Quick capture" />}>
              <p className="text-sm text-[var(--color-foreground)]/55">
                Renders QuickCapturePanel client-side.
              </p>
            </TodayPanel>
          </div>
        </Section>

        <Section title="Action bar (footer of dialogs)">
          <GlassCard aura className="overflow-hidden max-w-lg">
            <div className="px-5 py-4 text-sm">
              Dialog body content lives above this bar.
            </div>
            <ActionBar align="right">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Save
              </Button>
            </ActionBar>
          </GlassCard>
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 text-[0.68rem] font-mono uppercase tracking-[0.20em] text-[var(--color-foreground)]/45">
        {title}
      </h2>
      {children}
    </section>
  );
}
