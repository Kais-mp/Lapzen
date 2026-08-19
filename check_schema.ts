import { supabaseAdmin } from './src/lib/supabase-admin';

async function checkColumns() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Error fetching product:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    console.log('No products found or no data returned.');
  }
}

checkColumns();
