import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020817] text-slate-200">
      <Header />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                At Lapzen, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p>We may collect several types of information from and about users of our Site, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identifiers (name, email address, phone number, shipping address).</li>
                <li>Payment information (processed securely through our payment partners).</li>
                <li>Technical data (IP address, browser type, operating system).</li>
                <li>Usage data (how you interact with our website).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders.</li>
                <li>Communicate with you about your orders and inquiries.</li>
                <li>Improve our website and customer service.</li>
                <li>Send promotional emails (if you have opted in).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
              <p>
                We may share your information with third-party service providers (such as shipping companies and payment processors) only to the extent necessary to provide our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings, but this may affect site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: lapzen.store@gmail.com
                <br />
                Phone: +92 309 0009022
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

