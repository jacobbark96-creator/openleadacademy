const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing URL or SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function updateUser(email, password, role) {
  console.log(`Updating ${email}...`);
  // Get user id
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email.toLowerCase());
  
  if (!user) {
    console.log(`User ${email} not found.`);
    return;
  }
  
  // Update password and confirm email
  const { error: updateAuthError } = await supabase.auth.admin.updateUserById(user.id, {
    password: password,
    email_confirm: true
  });
  
  if (updateAuthError) {
    console.error("Update Auth Error:", updateAuthError.message);
  } else {
    console.log(`Updated password for ${email}`);
  }

  // Update role
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: role })
    .eq('id', user.id);
    
  if (profileError) {
    console.error("Update Profile Error:", profileError.message);
  } else {
    console.log(`Updated role to ${role} for ${email}`);
  }
}

async function main() {
  await updateUser('Jake@openlead-academy.com', 'Admin123!', 'admin');
  await updateUser('Nick@openlead-academy.com', 'Trainer123!', 'trainer');
}

main();