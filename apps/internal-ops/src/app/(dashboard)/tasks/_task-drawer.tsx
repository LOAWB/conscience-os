"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  ConfirmDialog,
  Drawer,
  EntityDetailLoading,
  FormError,
} from "@repo/ui";
import type { Task } from "@repo/db";
import { TaskForm } from "./_form";

export function TaskDrawer({
  clientOptions,
  projectOptions,
  leadOptions,
}: {
  clientOptions: { value: string; label: string }[];
  projectOptions: { value: string; label: string }[];
  leadOptions: { value: string; label: string }[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const openId = sp.get("open");

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!openId) {
      setTask(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/tasks/${openId}`)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error ?? `Failed (${r.status})`);
        }
        return r.json();
      })
      .then((j) => {
        if (!cancelled) setTask(j.item);
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load task.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [openId]);

  function close() {
    const next = new URLSearchParams(sp.toString());
    next.delete("open");
    router.replace(`?${next.toString()}`, { scroll: false });
  }

  async function deleteTask() {
    if (!task) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Failed (${res.status})`);
      }
      setConfirmDelete(false);
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Drawer
        open={!!openId}
        onClose={close}
        title={task ? task.title : "Task"}
        width={520}
        footer={
          task ? (
            <div className="flex items-center justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
              >
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={close}>
                Close
              </Button>
            </div>
          ) : null
        }
      >
        {loading ? (
          <EntityDetailLoading />
        ) : error ? (
          <FormError>{error}</FormError>
        ) : task ? (
          <TaskForm
            mode="edit"
            initial={task}
            clientOptions={clientOptions}
            projectOptions={projectOptions}
            leadOptions={leadOptions}
            onSaved={() => {
              close();
              router.refresh();
            }}
          />
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteTask}
        title="Delete this task?"
        description="The task will be removed permanently. This cannot be undone."
        confirmLabel="Delete"
        destructive
        busy={busy}
      />
    </>
  );
}
