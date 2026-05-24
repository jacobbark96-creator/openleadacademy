const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAccount(email, password, fullName, role) {
  console.log(`Creating ${email} as ${role}...`);
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (authError) {
    console.error("Auth Error:", authError.message);
    return;
  }

  const userId = authData.user.id;
  
  // Since there might be a trigger that created the profile as 'student', let's update it.
  // Or insert if it doesn't exist.
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: userId, role: role, full_name: fullName });

  if (profileError) {
    console.error("Profile Error:", profileError.message);
  } else {
    console.log(`Successfully created and configured ${email}`);
  }
}

async function main() {
  await createAccount('Jake@openlead-academy.com', 'password123', 'Jake Admin', 'admin');
  await createAccount('Nick@openlead-academy.com', 'password123', 'Nick Trainer', 'trainer');
}

main();