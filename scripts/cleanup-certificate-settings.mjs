import { createClient } from "@supabase/supabase-js";

const settingsKeysToDelete = [
  "kop_agency_1",
  "kop_agency_2",
  "school_address",
  "headmaster_nip",
  "cert_number_format",
  "site_url",
];

async function main() {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;

  if (!supabaseUrl) {
    throw new Error(
      "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL). " +
        "Set it before running this script."
    );
  }

  // Prefer a service role key to avoid RLS issues.
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (recommended). " +
        "As a fallback you may set NEXT_PUBLIC_SUPABASE_ANON_KEY, but deletion may fail under RLS."
    );
  }

  console.log("This will delete these keys from event_settings:");
  for (const key of settingsKeysToDelete) console.log(`- ${key}`);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase
    .from("event_settings")
    .delete()
    .in("key", settingsKeysToDelete);

  if (error) {
    throw new Error(`Supabase delete failed: ${error.message}`);
  }

  console.log("Done. Certificate-related event_settings keys removed (if they existed).");
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exitCode = 1;
});
