import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://umsfnckxuqkmzsndselx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtc2ZuY2t4dXFrbXpzbmRzZWx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM1MzM1MiwiZXhwIjoyMDk0OTI5MzUyfQ.hEzGXXNUj_zP3KvFk4ezsdUadM9yPfacDWNOMKyODMk'
);

async function fix() {
  // 1. Remove the custom domain from the master company so Jake can use it on his new test company
  await supabase.from('companies').update({ custom_domain: null }).eq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Fixed master company domain.');
}
fix();
