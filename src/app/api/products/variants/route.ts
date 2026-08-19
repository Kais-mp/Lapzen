import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = "force-dynamic";

// GET /api/products/variants?product_id=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');

  if (!product_id) {
    return NextResponse.json({ error: 'product_id required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .select('*')
    .eq('product_id', product_id)
    .order('variant_type')
    .order('price_adjustment');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/products/variants
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, variant_type, variant_value, price_adjustment } = body;

    if (!product_id || !variant_type || !variant_value) {
      return NextResponse.json({ error: 'product_id, variant_type, and variant_value are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .insert([{ product_id, variant_type, variant_value, price_adjustment: price_adjustment ?? 0 }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE /api/products/variants?id=xxx
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('product_variants')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
