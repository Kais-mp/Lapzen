import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import AboutHeroBanner from "@/components/sections/about-hero-banner";
import TeamGrid from "@/components/sections/team-grid";

export const metadata = {
  title: "About Us | LAPZEN",
  description: "Meet the team behind LAPZEN - your trusted destination for premium tech products.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHeroBanner />
        <TeamGrid />
      </main>
      <Footer />
    </>
  );
}
