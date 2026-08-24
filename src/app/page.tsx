import Header from "@/components/sections/header";
import HeroBanner from "@/components/sections/hero-banner";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { JsonLd } from "@/components/schema";
import PopupAdOverlay from "@/components/popup-ad";
import { ProductsSection } from "@/components/sections/featured-products";
import CategoryGrid from "@/components/sections/category-grid";
import PopularSeriesSection from "@/components/sections/popular-series-grid";
import BrandStory from "@/components/sections/brand-story";
import FAQAccordion from "@/components/sections/faq-accordion";
import BlogPostsSection from "@/components/sections/blog-posts";
import Footer from "@/components/sections/footer";

export default function Home() {
  // Fixed limits — the CSS grid handles responsiveness naturally
  // grid-cols-2 sm:3 md:4 lg:5 2xl:6 means max 12 fills 2 rows on all screens
  const featuredLimit = 12;
  const brandLimit = 6;

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Lapzen - Premium Laptops Store",
    "description": "Premium destination for high-performance laptops, featuring brands like Apple, Dell, and Asus.",
    "publisher": {
      "@type": "Organization",
      "name": "Lapzen"
    }
  };

  return (
    <div className="flex min-h-screen flex-col selection:bg-navy/10">
        <JsonLd data={homeSchema} />
        <PopupAdOverlay />
        <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        
        <ScrollReveal delay={0.1}>
          <ProductsSection 
            title="Featured Laptops"
            description="Our top picks for power and performance"
            type="featured"
            viewAllLink="/catalog?featured=true"
            limit={featuredLimit}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ProductsSection 
            title="New Arrivals"
            description="Check out our latest high-performance laptops"
            type="new_arrival"
            viewAllLink="/catalog?new_arrival=true"
            limit={featuredLimit}
          />
        </ScrollReveal>

        <ScrollReveal>
          <ProductsSection 
            title="HP Laptops"
            description="Premium HP laptops for work and play"
            brand="HP"
            limit={brandLimit}
            viewAllLink="/brands/hp"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ProductsSection 
            title="Dell Laptops"
            description="High-performance Dell laptops for every professional"
            brand="Dell"
            limit={brandLimit}
            viewAllLink="/brands/dell"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ProductsSection 
            title="Apple MacBooks"
            description="Experience the power of M-series chips"
            brand="Apple"
            limit={brandLimit}
            viewAllLink="/brands/apple"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <ProductsSection 
            title="Lenovo Laptops"
            description="Reliable and versatile laptops for everyone"
            brand="Lenovo"
            limit={brandLimit}
            viewAllLink="/brands/lenovo"
          />
        </ScrollReveal>

        <ScrollReveal>
          <ProductsSection 
            title="Acer Laptops"
            description="Value-packed Acer laptops for students and home use"
            brand="Acer"
            limit={brandLimit}
            viewAllLink="/brands/acer"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ProductsSection 
            title="Toshiba Laptops"
            description="Durable Toshiba laptops for everyday tasks"
            brand="Toshiba"
            limit={brandLimit}
            viewAllLink="/brands/toshiba"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <CategoryGrid />
        </ScrollReveal>

        <ScrollReveal>
          <PopularSeriesSection />
        </ScrollReveal>

        <div className="relative overflow-hidden">
          <div className="grid-overlay absolute inset-0 pointer-events-none opacity-40" />
          <ScrollReveal direction="up">
            <BrandStory />
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <FAQAccordion />
        </ScrollReveal>

        <ScrollReveal>
          <BlogPostsSection />
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
