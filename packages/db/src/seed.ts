/**
 * Seed bootstrap for first-deploy owner provisioning.
 *
 * Reads SEED_OWNER_EMAIL + SEED_OWNER_PASSWORD_HASH from env. Inserts a
 * single users row with role='owner' if and only if the users table is
 * empty. Subsequent runs are no-ops. After first sign-in, the env vars
 * become unused and can be removed from the Railway service.
 *
 * Run via: pnpm --filter @repo/db db:seed
 */
import { getDb, isDbConnected } from "./client";
import { users } from "./schema";

async function main() {
  if (!isDbConnected()) {
    console.error("[@repo/db seed] DATABASE_URL is not set; aborting.");
    process.exit(1);
  }

  const seedEmail = process.env.SEED_OWNER_EMAIL;
  const seedHash = process.env.SEED_OWNER_PASSWORD_HASH;

  if (!seedEmail || !seedHash) {
    console.warn(
      "[@repo/db seed] SEED_OWNER_EMAIL and/or SEED_OWNER_PASSWORD_HASH not set; skipping. Manual seed required via SQL or future invitation flow.",
    );
    return;
  }

  const db = getDb();
  const existing = await db.select({ id: users.id }).from(users).limit(1);

  if (existing.length > 0) {
    console.log(
      "[@repo/db seed] users table already has at least one row; skipping seed.",
    );
    return;
  }

  await db.insert(users).values({
    email: seedEmail,
    passwordHash: seedHash,
    role: "owner",
    name: "Conscience Os Owner",
  });

  console.log(
    `[@repo/db seed] seeded owner row for ${seedEmail} (role=owner).`,
  );
}

main().catch((err) => {
  console.error("[@repo/db seed] fatal:", err);
  process.exit(1);
});
