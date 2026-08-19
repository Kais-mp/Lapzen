import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface BlogPost {
  id: string;
  title: string;
  link: string | null;
  slug: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }

  return data || [];
}

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex min-h-screen flex-col selection:bg-navy/10">
      <Header />
      
      <main className="flex-grow bg-slate-50">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-5 lg:px-8 max-w-[1400px]">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Our Blog
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
                All Blog Posts
              </h1>
              <p className="text-slate-500 mt-2 max-w-md">
                Stay updated with the latest tech news, reviews, and guides
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-navy mb-2">No Blog Posts Yet</h3>
                <p className="text-slate-500">Check back later for new articles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => {
                    const isInternal = !!post.slug;
                    const href = isInternal ? `/blog/${post.slug}` : (post.link || "#");

                  
                  return (
                    <Link
                      key={post.id}
                      href={href}
                      target={isInternal ? undefined : "_blank"}
                      rel={isInternal ? undefined : "noopener noreferrer"}
                      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-500"
                    >
                        <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                          {post.image_url ? (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (

                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/5 to-blue-500/10">
                            <BookOpen className="w-12 h-12 text-navy/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <div className="p-6">
                        <p className="text-xs text-slate-400 mb-2">
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                        <h3 className="font-bold text-navy text-lg leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                          <span>Read Article</span>
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
