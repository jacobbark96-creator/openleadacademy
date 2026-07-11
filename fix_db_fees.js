import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://umsfnckxuqkmzsndselx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtc2ZuY2t4dXFrbXpzbmRzZWx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM1MzM1MiwiZXhwIjoyMDk0OTI5MzUyfQ.hEzGXXNUj_zP3KvFk4ezsdUadM9yPfacDWNOMKyODMk'
);

async function apply() {
  const { error } = await supabase.rpc('exec_sql', { sql_string: `
    ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS signup_fee numeric(10, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS has_paid_signup_fee boolean DEFAULT true;
  `});
  if (error) {
     console.log('Cant use exec_sql, generating script for user instead');
  } else {
     console.log('Applied columns');
  }
}
apply();
