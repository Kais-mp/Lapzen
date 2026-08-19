import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;


const supabase = createClient(url, key);

async function test() {
  console.log("Testing connection...");
  const start = Date.now();
  const { data, error } = await supabase.from('products').select('id, name').limit(5);
  const end = Date.now();
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Fetched", data?.length, "rows in", end - start, "ms");
    console.log("Sample:", data?.[0]);
  }
}

test();


