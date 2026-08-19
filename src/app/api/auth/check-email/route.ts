import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists in auth.users
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;

    const userExists = users.some(u => u.email === email);

    return NextResponse.json({ exists: userExists });
  } catch (err: any) {
    console.error('Check email error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
