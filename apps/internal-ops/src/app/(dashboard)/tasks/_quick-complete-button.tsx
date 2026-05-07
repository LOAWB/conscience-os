"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "@repo/ui";
import { Check } from "lucide-react";

export function QuickCompleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function complete(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setBusy(true);
    try {
      await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <IconButton label="Mark complete" onClick={complete} disabled={busy}>
      <Check className="size-4" />
    </IconButton>
  );
}
