import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key] = value.replace(/['"]/g, '').trim();
  return acc;
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'jake.bedwell@kairostudio.co.uk',
    password: 'password123' 
  });
  
  if (authError) {
    console.error('Auth error:', authError);
    return;
  }
  
  console.log('Logged in as:', authData.user?.id);
  
  const companyId = 'e2f91d31-1b2b-4654-a3ff-0002bc3bf4c0';
  
  const { data, error } = await supabase
    .from('companies')
    .update({ primary_color: '#ff0000' })
    .eq('id', companyId)
    .select();
    
  console.log('Update result:', data, error);
}

test();