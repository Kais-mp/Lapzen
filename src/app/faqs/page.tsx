import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import FAQsFullContent from "@/components/sections/faqs-full-content";

export const metadata = {
  title: "FAQs | LAPZEN",
  description: "Frequently asked questions about Lapzen laptops, shipping, and warranty.",
};

export default function FAQsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <FAQsFullContent />
      </main>
      <Footer />
    </div>
  );
}
