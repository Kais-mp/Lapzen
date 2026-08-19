import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { slugify } from '@/lib/slugify';

const BASE_URL = 'https://lapzen.shop';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/catalog',
    '/collections',
    '/blog',
    '/about',
    '/contact-us',
    '/faqs',
    '/privacy',
    '/terms',
    '/warranty',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch products
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('title, brand, series, category, created_at');

  const productRoutes = (products || []).map((product) => ({
    url: `${BASE_URL}/products/${slugify(product.title)}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Brands, Series, and Categories from products
  const brands = Array.from(new Set(products?.map((p) => p.brand).filter(Boolean)));
  const series = Array.from(new Set(products?.map((p) => p.series).filter(Boolean)));
  const categories = Array.from(new Set(products?.map((p) => p.category).filter(Boolean)));

  const brandRoutes = brands.map((brand) => ({
    url: `${BASE_URL}/brands/${slugify(brand!)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const seriesRoutes = series.map((s) => ({
    url: `${BASE_URL}/series/${slugify(s!)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categoryRoutes = categories.map((cat) => ({
    url: `${BASE_URL}/collections/${slugify(cat!)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Fetch blog posts
  const { data: blogs } = await supabaseAdmin
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_active', true);

  const blogRoutes = (blogs || []).map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...brandRoutes,
    ...seriesRoutes,
    ...categoryRoutes,
  ];
}
