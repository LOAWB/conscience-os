import { redirect } from "next/navigation";
import { ShellLayout } from "@repo/ui";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <ShellLayout
      session={{
        email: session.email,
        name: session.name,
        role: session.role,
      }}
    >
      {children}
    </ShellLayout>
  );
}
