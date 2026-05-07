import { requireRole } from "@/lib/role-guard";
import { handleError, json } from "@/lib/http";
import { getTodaySnapshot } from "@/lib/queries/today";

export const GET = requireRole(["owner", "operator"], async () => {
  try {
    const snapshot = await getTodaySnapshot();
    return json(snapshot);
  } catch (err) {
    return handleError(err);
  }
});

export const dynamic = "force-dynamic";
