import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ProductsSection } from "@/components/sections/featured-products";
import { JsonLd } from "@/components/schema";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export default async function CollectionPage(props: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const slug = params?.slug || "";

  if (!slug) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow pt-32 text-center">
          <h1 className="text-2xl font-bold">Collection not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  if (slug === "all") {
    redirect("/catalog");
  }

  const normalizedSlug = slug.toLowerCase().replace(/-/g, ' ');
  const matchedCategory = CATEGORIES.find(cat => cat.toLowerCase() === normalizedSlug);
  
  const title = matchedCategory || (slug && slug.length > 0 ? (slug?.charAt(0) ?? "").toUpperCase() + slug.slice(1) : "Collection");
  
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${title} Laptops Collection`,
    "description": `Browse our premium collection of ${title} laptops at Lapzen.`,
    "url": `https://lapzen.store/collections/${slug}`
  };

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={collectionSchema} />
      <Header />
      <main className="flex-grow pt-12">
          <div className="container max-w-[1536px] mb-8">
          <h1 className="text-4xl font-bold text-navy uppercase tracking-tighter">
            {title} Collection
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover our premium selection of {title} devices.
          </p>
        </div>
        <ProductsSection 
          brand={!matchedCategory ? title : undefined} 
          category={matchedCategory}
        />
      </main>
      <Footer />
    </div>
  );
}
