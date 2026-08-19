import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limiter = rateLimit(ip, 50, 60000);

  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { slug } = await params;

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', slug) // Note: The API might still receive IDs in some cases, so we keep using .eq('id', slug) or handle both
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limiter = rateLimit(ip, 20, 60000);

  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { slug } = await params;

  const { error } = await supabaseAdmin.from('products').delete().eq('id', slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limiter = rateLimit(ip, 20, 60000);

  if (!limiter.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();

    // Clean up the body to only include valid fields
    const cleanBody: any = {};
    const validFields = [
      'title', 'description', 'price', 'brand', 'category', 'series',
      'type', 'specs', 'image_urls', 'new_arrival', 'featured', 'stock',
      'discount_type', 'discount_value'
    ];

    for (const field of validFields) {
      if (field in body) {
        cleanBody[field] = body[field];
      }
    }

    console.log('PUT body:', cleanBody);

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(cleanBody)
      .eq('id', slug)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Catch error:', error);
    return NextResponse.json({ error: 'Invalid request', details: String(error) }, { status: 400 });
  }
}
