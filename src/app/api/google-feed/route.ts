import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slugify";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case "\"":
        return "&quot;";
    }
    return c;
  });
}

export async function GET() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(`Error fetching products: ${error.message}`, { status: 500 });
  }

  const baseUrl = "https://lapzen.shop";

      const items = products.map((product) => {
        const slug = slugify(product.title);
        const productUrl = `${baseUrl}/products/${slug}`;
        
        // Handle images
        const imageUrls = product.image_urls || (product.image_url ? [product.image_url] : []);
        const mainImage = imageUrls[0] || `${baseUrl}/logo.png`;
        const additionalImages = imageUrls.slice(1)
          .map((url: string) => `<g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
          .join("\n        ");

        const availability = "in stock";
        const price = `${product.price} PKR`;
        
        // Generate MPN from ID if not present in specs
        const mpn = product.specs?.model || product.specs?.mpn || product.id.split("-")[0].toUpperCase();

        return `
        <item>
          <g:id>${escapeXml(product.id)}</g:id>
          <g:title>${escapeXml(product.title)}</g:title>
          <g:description>${escapeXml(product.description || `Buy ${product.title} at Lapzen.`)}</g:description>
          <g:link>${escapeXml(product.url || productUrl)}</g:link>
          <g:image_link>${escapeXml(mainImage)}</g:image_link>
          ${additionalImages}
          <g:condition>new</g:condition>
          <g:availability>${escapeXml(availability)}</g:availability>
          <g:price>${escapeXml(price)}</g:price>
          <g:brand>${escapeXml(product.brand || "Lapzen")}</g:brand>
          <g:mpn>${escapeXml(mpn)}</g:mpn>
          <g:google_product_category>Electronics &gt; Computers &gt; Laptops</g:google_product_category>
        </item>`;
      }).join("");

  const xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Lapzen - Premium Laptops Store</title>
    <link>${baseUrl}</link>
    <description>Premium destination for high-performance laptops, featuring brands like Apple, Dell, and Asus.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
