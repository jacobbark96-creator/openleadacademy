const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: `
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_fee_currency text DEFAULT 'GBP';
    NOTIFY pgrst, 'reload schema';
  ` });
  console.log("RPC Error:", error);
}
run();
