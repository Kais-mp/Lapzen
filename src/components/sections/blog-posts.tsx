"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  link: string | null;
  slug: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function BlogPostsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blog-posts?limit=3");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="container mx-auto px-5 lg:px-8 max-w-[1400px]">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-slate-50">
      <div className="container mx-auto px-5 lg:px-8 max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Latest Articles
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
              From Our Blog
            </h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Stay updated with the latest tech news, reviews, and guides
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="group border-navy text-navy hover:bg-navy hover:text-[#00172E]">
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform hover:text-[#00172E] " />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => {
            const isInternal = !!post.slug;
            const href = isInternal ? `/blog/${post.slug}` : (post.link || "#");
            
            return (
              <motion.a
                key={post.id}
                href={href}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-500"
              >
                  <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={75}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/5 to-blue-500/10">
                      <BookOpen className="w-12 h-12 text-navy/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-navy text-lg leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BlogPostsSection;
