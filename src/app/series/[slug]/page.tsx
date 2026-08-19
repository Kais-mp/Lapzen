import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ProductsSection } from "@/components/sections/featured-products";
import { JsonLd } from "@/components/schema";
import { notFound } from "next/navigation";
import { SERIES_MAPPING } from "@/lib/constants";

export default async function SeriesPage(props: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const slug = params?.slug || "";

  const seriesName = slug ? SERIES_MAPPING[slug] : undefined;

  if (!seriesName) {
    notFound();
  }
  
  const seriesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${seriesName} Laptops Collection`,
    "description": `Browse our premium collection of ${seriesName} laptops at Lapzen.`,
    "url": `https://lapzen.store/series/${slug}`
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={seriesSchema} />
      <Header />
        <main className="flex-grow pt-32">
          <div className="container px-5 lg:px-8 max-w-[1536px] mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#002b5c] uppercase tracking-tighter">
            {seriesName} <span className="text-red-600">Collection</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl leading-relaxed">
            Discover our premium selection of high-performance {seriesName} devices, engineered for excellence.
          </p>
        </div>
        <ProductsSection 
          series={seriesName} 
          title={`${seriesName} Lineup`} 
          description={`Explore the latest models in the ${seriesName} series.`} 
          showViewAll={false}
        />
      </main>
      <Footer />
    </div>
  );
}
