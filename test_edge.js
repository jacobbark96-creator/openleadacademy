import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const testEmail = 'test_edge_' + Date.now() + '@example.com';
  const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
    email: testEmail,
    password: 'Password123!',
    email_confirm: true
  });
  if (authError) {
    console.error('Auth error:', authError);
    return;
  }
  
  // Sign in to get token
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: 'Password123!'
  });
  
  const token = loginData.session.access_token;
  
  // create dummy company
  const { data: comp } = await serviceClient.from('companies').insert({ name: 'Dummy Co', slug: 'dummy-' + Date.now() }).select().single();
  
  await serviceClient.from('profiles').update({ role: 'admin', company_id: comp.id }).eq('id', authData.user.id);
  
  const response = await fetch(supabaseUrl + '/functions/v1/admin-manage-users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ action: 'list' })
  });
  const responseData = await response.json();
  console.log('Edge function Status:', response.status);
  console.log('Edge function Data:', responseData.length, 'users returned.');
  if (responseData.length > 0) {
    console.log('First user:', responseData[0]);
  }
}
test();