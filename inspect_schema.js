const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('hotdeals').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log('Sample Row Keys:', Object.keys(data[0] || {}));
    console.log('Sample Row:', data[0]);
  }
}

inspect();
