import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import WarrantyReturnsContent from "@/components/sections/warranty-returns-content";

export const metadata = {
  title: "Warranty & Returns | LAPZEN",
  description: "Check out Lapzen's warranty, return, and shipping policies.",
};

export default function WarrantyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <WarrantyReturnsContent />
      </main>
      <Footer />
    </div>
  );
}
