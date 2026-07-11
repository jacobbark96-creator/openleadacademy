const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, custom_domain')
    .not('custom_domain', 'is', null);
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Registered Custom Domains:');
  data.forEach(c => {
    console.log(`- Company: ${c.name}, Domain: ${c.custom_domain}`);
  });
}
run();
