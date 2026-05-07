// @repo/ui — Conscience Os locked design system.
//
// 50-primitive publish surface (originally 27, expanded per A1 amendment so
// face-f composes domain modules without inlining duplicates).
//
// Owned tokens, fonts, animations, glass surfaces, brand wordmark.
// NEVER drifts from #06080d / #f4f4f5 / #3b7dff / Geist / glass cards / wordmark
// with shimmer + comet ring without LANE-CHANGE-PROPOSAL.

export { cn } from "./lib/cn";
export { tokens } from "./tokens";
export type { Tokens } from "./tokens";

export {
  LEAD_STATUSES,
  LEAD_STATUSES_LEGACY,
  CLIENT_STATUSES,
  PROJECT_STATUSES,
  TASK_STATUSES,
  TASK_PRIORITIES,
  EVENT_TYPES,
} from "./types";
export type {
  LeadStatus,
  LeadStatusLegacy,
  ClientStatus,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  EventType,
} from "./types";

// Shell
export { ShellLayout } from "./shell/shell-layout";
export { Sidebar, SIDEBAR_NAV, SIDEBAR_FOOTER_NAV } from "./shell/sidebar";
export { TopBar } from "./shell/topbar";

// Chrome
export { PageHeader } from "./chrome/page-header";
export { SectionHeader } from "./chrome/section-header";
export { ActionBar } from "./chrome/action-bar";

// Primitives — surfaces
export { GlassCard } from "./primitives/glass-card";
export { Wordmark, ConscienceMark } from "./primitives/wordmark";
export { IconBox } from "./primitives/icon-box";
export { AuraGlow } from "./primitives/aura-glow";

// Primitives — buttons
export { Button } from "./primitives/button";
export type { ButtonVariant, ButtonSize } from "./primitives/button";
export { LinkButton } from "./primitives/link-button";
export { IconButton } from "./primitives/icon-button";

// Primitives — status / chips
export { StatusBadge } from "./primitives/status-badge";
export { PriorityChip } from "./primitives/priority-chip";
export { Tag } from "./primitives/tag";
export { Avatar } from "./primitives/avatar";

// Forms
export { FormField } from "./forms/form-field";
export { TextInput } from "./forms/text-input";
export { TextArea } from "./forms/text-area";
export { Select } from "./forms/select";
export { DateTimePicker } from "./forms/datetime-picker";
export { SwitchInput } from "./forms/switch-input";
export { FormError } from "./forms/form-error";
export { CheckboxInput } from "./forms/checkbox-input";
export { SearchInput } from "./forms/search-input";

// List surfaces
export { FilterTabs, SegmentedControl } from "./list/filter-tabs";
export { SortSelect } from "./list/sort-select";
export { Pagination } from "./list/pagination";
export { DataList } from "./list/data-list";
export type { DataListColumn } from "./list/data-list";

// Detail surfaces
export { DetailPanel } from "./detail/detail-panel";
export { DetailField } from "./detail/detail-field";
export { Tabs } from "./detail/tabs";
export { Drawer } from "./detail/drawer";

// Overlays
export { Modal } from "./overlays/modal";
export { ConfirmDialog } from "./overlays/confirm-dialog";
export { DropdownMenu } from "./overlays/dropdown-menu";

// Data rendering
export { ProgressBar } from "./data-rendering/progress-bar";
export { Checklist } from "./data-rendering/checklist";
export type { ChecklistItem } from "./data-rendering/checklist";
export { Timeline } from "./data-rendering/timeline";
export type { TimelineItem } from "./data-rendering/timeline";
export { NoteComposer } from "./data-rendering/note-composer";

// Notifications
export { InlineNotice, Toast } from "./notifications/inline-notice";

// States
export { EntityListLoading } from "./states/entity-list-loading";
export { EntityDetailLoading } from "./states/entity-detail-loading";
export { EntityEmptyState } from "./states/entity-empty-state";
export { ErrorBoundaryFallback } from "./states/error-boundary-fallback";

// Today view composition
export { TodayPanel } from "./today/today-panel";
export { CountStrip } from "./today/count-strip";
export type { Count } from "./today/count-strip";
export { QuickCapturePanel } from "./today/quick-capture-panel";
export type { QuickCaptureIntent } from "./today/quick-capture-panel";
