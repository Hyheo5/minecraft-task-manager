import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching nodes...');
  const { data, error } = await supabase.from('nodes').select('*');
  console.log('Select Result:', data);
  if (error) console.error('Select Error:', error);

  console.log('Inserting test node...');
  const { data: insertData, error: insertError } = await supabase.from('nodes').insert({
    id: 'test_node_' + Date.now(),
    title: 'Test Node',
    description: 'Test description',
    progress: 50,
    properties: {},
    position_x: 0,
    position_y: 0
  }).select();
  console.log('Insert Result:', insertData);
  if (insertError) console.error('Insert Error:', insertError);
}

test();
