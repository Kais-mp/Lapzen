import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Only create the client if we have the credentials, otherwise export a proxy or handle it gracefully
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseServiceKey || "placeholder-key", 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
