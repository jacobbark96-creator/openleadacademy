import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://umsfnckxuqkmzsndselx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtc2ZuY2t4dXFrbXpzbmRzZWx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM1MzM1MiwiZXhwIjoyMDk0OTI5MzUyfQ.hEzGXXNUj_zP3KvFk4ezsdUadM9yPfacDWNOMKyODMk'
);

async function check() {
  const { data: companies } = await supabase.from('companies').select('*');
  console.log('COMPANIES:', JSON.stringify(companies, null, 2));
}
check();
