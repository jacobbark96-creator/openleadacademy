const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, signup_fee, has_paid_signup_fee, company_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Last 5 Users:');
  profiles.forEach(p => {
    console.log(`- Email: ${p.email}, Fee: ${p.signup_fee}, Paid: ${p.has_paid_signup_fee}, Created: ${p.created_at}`);
  });
}
run();
