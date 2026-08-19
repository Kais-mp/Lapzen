import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  noStore();
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, slug, content, image_url } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert([{ title, description, slug, content, image_url, is_active: true }])
      .select()
      .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      revalidatePath("/blog");
      if (slug) revalidatePath(`/blog/${slug}`);

      return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

  export async function PUT(request: NextRequest) {
    try {
      const body = await request.json();
      const { id, title, description, is_active, slug, content, image_url } = body;
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      // Build update object with only defined fields
      const updateData: any = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (slug !== undefined) updateData.slug = slug;
      if (content !== undefined) updateData.content = content;
      if (image_url !== undefined) updateData.image_url = image_url;
  
      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .maybeSingle();
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      if (!data) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }

      revalidatePath("/blog");
      if (data.slug) revalidatePath(`/blog/${data.slug}`);
      if (slug && slug !== data.slug) revalidatePath(`/blog/${slug}`);
  
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Get the post first to know the slug for revalidation
    const { data: post } = await supabaseAdmin
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .single();

    const { error } = await supabaseAdmin
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/blog");
    if (post?.slug) revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
