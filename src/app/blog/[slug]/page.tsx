import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { JsonLd } from "@/components/schema";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default async function BlogPostPage(props: { 
  params: Promise<{ slug: string }>;
}) {
  noStore();
  const params = await props.params;
  const slug = params?.slug || "";

  if (!slug) return notFound();

  const { data: blogPost } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!blogPost || !blogPost.content) {
    return notFound();
  }

    // Fetch other blog posts for the sidebar
    const { data: otherPosts } = await supabaseAdmin
      .from("blog_posts")
      .select("title, slug, image_url, created_at")
      .eq("is_active", true)
      .neq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(30);

    const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPost.title,
    "image": blogPost.image_url,
    "datePublished": blogPost.created_at,
    "author": {
      "@type": "Organization",
      "name": "Lapzen"
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <JsonLd data={blogSchema} />
      <Header />
      <main className="flex-grow pt-48 md:pt-60 pb-20">
        <div className="container mx-auto px-5 lg:px-8 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content Area */}
                <article className="lg:col-span-8">
                  <div className="mb-10">
                  <div className="flex items-center gap-3 text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
                  <span>Insights</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{format(new Date(blogPost.created_at), "MMM dd, yyyy")}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-8 tracking-tight leading-[1.1]">
                  {blogPost.title}
                </h1>
              </div>
              
              <div 
                className="prose prose-lg max-w-none prose-headings:text-navy prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-3xl prose-strong:text-navy"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              <div className="sticky top-32">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-navy mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-600 rounded-full" />
                    Posts you might like
                  </h3>
                  
                  <div className="space-y-8">
                    {otherPosts?.map((post) => (
                      <Link 
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-4 items-start"
                      >
                          <div className="relative w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                            <img
                              src={post.image_url || "/placeholder.jpg"}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-bold text-navy leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar size={12} />
                            {format(new Date(post.created_at), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-50">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center gap-2 text-navy font-bold hover:text-blue-700 transition-colors group"
                    >
                      View all articles
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Newsletter or CTA Card */}
                <div className="mt-8 bg-navy rounded-[2rem] p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/30 transition-colors" />
                  <h4 className="text-2xl font-bold mb-4 relative z-10">Looking for a new laptop?</h4>
                  <p className="text-blue-100/80 mb-6 relative z-10">Check out our latest collection of premium high-performance laptops.</p>
                  <Link 
                    href="/catalog"
                    className="inline-flex items-center justify-center w-full py-4 bg-white text-navy font-bold rounded-xl hover:bg-blue-50 transition-colors relative z-10"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
