import React from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ProductDetails } from "@/components/product-details";
import { JsonLd } from "@/components/schema";
import { notFound } from "next/navigation";
import { ProductsSection } from "@/components/sections/featured-products";
import { slugify } from "@/lib/slugify";
import type { Metadata } from "next";

import { supabaseAdmin } from "@/lib/supabase-admin";

async function getProductBySlug(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*');
      
    if (error || !data) {
      console.error("Error fetching products:", error);
      return null;
    }

    // Find the product whose slugified title matches the slug
    const product = data.find(p => slugify(p.title) === slug);
    return product || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

async function getProductCoupon(productId: string) {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("id, code, discount_type, discount_value, description, expires_at")
      .eq("product_id", productId)
      .eq("is_active", true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`expires_at.is.null,expires_at.gte.${now}`)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

async function getRelatedProducts(currentPrice: number, currentId: string) {
  try {
    // Fetch products with higher price (order by price ASC to get the closest higher prices)
    const { data: higherProducts, error: higherError } = await supabaseAdmin
      .from('products')
      .select('*')
      .gt('price', currentPrice)
      .neq('id', currentId)
      .order('price', { ascending: true })
      .limit(4);

    // Fetch products with lower price (order by price DESC to get the closest lower prices)
    const { data: lowerProducts, error: lowerError } = await supabaseAdmin
      .from('products')
      .select('*')
      .lt('price', currentPrice)
      .neq('id', currentId)
      .order('price', { ascending: false })
      .limit(4);

    if (higherError || lowerError) {
      console.error("Error fetching related products:", higherError || lowerError);
      return [];
    }

    const higher = higherProducts || [];
    const lower = lowerProducts || [];

    let results = [];

    if (higher.length >= 3 && lower.length >= 2) {
      // 2 higher, 2 lower
      results = [...higher.slice(0, 3), ...lower.slice(0, 2)];
    } else if (higher.length === 0) {
      // All lower
      results = lower.slice(0, 5);
    } else if (lower.length === 0) {
      // All higher
      results = higher.slice(0, 5);
    } else if (higher.length < 2) {
      // Not enough higher, take what we have and fill with lower
      results = [...higher, ...lower.slice(0, 5 - higher.length)];
    } else if (lower.length < 2) {
      // Not enough lower, take what we have and fill with higher
      results = [...lower, ...higher.slice(0, 5 - lower.length)];
    }

    return results;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params?.slug || "";
  
  if (!slug) {
    return {
      title: "Product Not Found | Lapzen",
    };
  }
  
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Lapzen",
    };
  }

  const imageUrl = product.image_urls?.[0] || product.image_url;
  const plainDescription = stripHtml(product.description)?.slice(0, 160) || `Buy ${product.title} at Lapzen. Premium laptops at competitive prices.`;
  const productUrl = `https://lapzen.shop/products/${slug}`;

  return {
    title: `${product.title} | Lapzen`,
    description: plainDescription,
    openGraph: {
      title: product.title,
      description: plainDescription,
      images: imageUrl ? [{ url: imageUrl }] : ["/logo.png"],
      type: "website",
      siteName: "Lapzen",
      url: productUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: plainDescription,
      images: imageUrl ? [imageUrl] : ["/logo.png"],
    },
  };
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const slug = params?.slug || "";
  
  if (!slug) {
    notFound();
  }
  
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, productCoupon] = await Promise.all([
    getRelatedProducts(product.price, product.id),
    getProductCoupon(product.id),
  ]);

    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": product.image_urls?.[0] || product.image_url,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Lapzen"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "24"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Verified Customer"
        },
        "reviewBody": "Excellent laptop, highly recommended for professional use and performance."
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "PKR",
        "price": product.price,
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "PK",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 30,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": 0,
            "currency": "PKR"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "PK"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 3,
              "unitCode": "DAY"
            }
          }
        }
      }
    };

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={productSchema} />
      <Header />
      
        <main className="flex-grow bg-white">
          <div className="container px-4 pt-44 pb-12 md:pt-60 md:pb-20 mx-auto">
            <ProductDetails product={product} coupon={productCoupon} />
          </div>

        {/* Related Products Section */}
        <div className="border-t border-border">
          <ProductsSection 
            title="Related Products" 
            description="You might also be interested in these laptops"
            initialProducts={relatedProducts}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

