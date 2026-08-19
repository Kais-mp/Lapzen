import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data: updateData, error: updateError } = await supabaseAdmin.storage.updateBucket('3d Model', {
      public: true
    });
    
    if (updateError) throw updateError;

    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketsError) throw bucketsError;

    const bucketInfo = await Promise.all(buckets.map(async (bucket) => {
      const { data: files, error: filesError } = await supabaseAdmin.storage.from(bucket.name).list('', { limit: 10 });
      return {
        name: bucket.name,
        public: bucket.public,
        files: filesError ? [] : files.map(f => f.name)
      };
    }));

    const publicUrl = supabaseAdmin.storage.from('3d Model').getPublicUrl('laptop_dell_xps.glb').data.publicUrl;
    const testFetch = await fetch(publicUrl, { method: 'HEAD' });

    return NextResponse.json({ 
      buckets: bucketInfo,
      publicUrl,
      status: testFetch.status,
      statusText: testFetch.statusText
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
