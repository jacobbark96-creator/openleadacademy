const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, signup_fee, has_paid_signup_fee, company_id')
    .order('created_at', { ascending: false })
    .limit(1);
    
  console.log('Latest Profile:', JSON.stringify(profiles[0], null, 2));
}
run();
