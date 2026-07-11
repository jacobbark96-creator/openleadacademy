const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: modules, error: mError } = await supabase.from('modules').select('*').limit(1);
  if (mError) console.error('Modules Table Error:', mError.message);
  else console.log('Modules Table exists and is accessible.');

  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
  if (pError) console.error('Profiles Table Error:', pError.message);
  else console.log('Profiles Table columns:', Object.keys(profiles[0] || {}));
}
run();
