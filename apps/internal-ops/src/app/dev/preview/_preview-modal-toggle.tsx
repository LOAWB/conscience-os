"use client";

import { useState } from "react";
import { Button, ConfirmDialog, Drawer, Modal, ActionBar } from "@repo/ui";

export function PreviewModalToggle() {
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [drawer, setDrawer] = useState(false);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Button variant="secondary" size="sm" onClick={() => setModal(true)}>
        Open modal
      </Button>
      <Button variant="secondary" size="sm" onClick={() => setConfirm(true)}>
        Open confirm
      </Button>
      <Button variant="secondary" size="sm" onClick={() => setDrawer(true)}>
        Open drawer
      </Button>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Modal preview"
        description="Hit ESC or click backdrop to close."
        footer={
          <ActionBar align="right">
            <Button variant="ghost" size="sm" onClick={() => setModal(false)}>
              Close
            </Button>
          </ActionBar>
        }
      >
        <p className="text-sm text-[var(--color-foreground)]/75">
          Modal body content area. Used for forms that don't warrant a route.
        </p>
      </Modal>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => setConfirm(false)}
        title="Delete this lead?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
      />
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Task detail (drawer)"
      >
        <div className="px-5 py-4 text-sm text-[var(--color-foreground)]/75">
          Drawer body. Used by Tasks list (per F2) so operators stay in the list
          while editing.
        </div>
      </Drawer>
    </div>
  );
}
