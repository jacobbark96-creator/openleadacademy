const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, signup_fee, has_paid_signup_fee, company_id')
    .filter('signup_fee', 'gt', 0)
    .order('created_at', { ascending: false });
    
  console.log('Users with fees:', JSON.stringify(profiles, null, 2));
}
run();
