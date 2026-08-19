"use client";

import React, { useEffect, useRef } from 'react';
import { Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodeCount = 25;
    const connectionDistance = 180;
    const nodeRadius = 4;

    if (nodesRef.current.length === 0) {
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

const FooterSection = () => {
  return (
    <footer className="relative bg-[#0c1221] text-white pt-[80px] pb-[40px] overflow-hidden font-sans">
      <NetworkBackground />

      {/* Main Footer Content */}
      <div className="container relative z-10 mx-auto px-5 md:px-[20px] max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-[40px] gap-y-[50px] mb-[60px]">
          
          {/* Column 1: Contact Us */}
          <div className="footer-column flex flex-col">
            <h2 className="footer-heading">Contact Us</h2>
            <div className="space-y-[18px]">
              <div className="text-[14px] leading-[1.6]">
                <p className="font-bold text-white mb-1.5 opacity-90">Our Shop</p>
                <p className="opacity-60">Hafeez Centre, Lahore</p>
              </div>
              <div className="space-y-3">
                <a
                  href="https://wa.me/923090009022"
                  className="footer-link">
                  <Phone size={14} className="flex-shrink-0 text-accent" />
                  <span>+92 309 0009022</span>
                </a>
                <a
                  href="mailto:lapzen.store@gmail.com"
                  className="footer-link">
                  <Mail size={14} className="flex-shrink-0 text-accent" />
                  <span>lapzen.store@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="footer-column flex flex-col">
            <h2 className="footer-heading">Products</h2>
            <ul className="list-none p-0 m-0 space-y-1">
              {['Acer', 'Apple', 'Dell', 'HP', 'Lenovo', 'Toshiba'].map((product) =>
                <li key={product}>
                  <a
                    href={`/brands/${product.toLowerCase()}`}
                    className="footer-link">
                    <span className="text-[10px] text-accent/60">•</span>
                    {product}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Account */}
          <div className="footer-column flex flex-col">
            <h2 className="footer-heading">Account</h2>
            <ul className="list-none p-0 m-0 space-y-1">
              {[
                { label: 'Sign Up', href: '/signup' },
                { label: 'My Account', href: '/account' },
                { label: 'Shopping Cart', href: '/cart' },
                { label: 'Order History', href: '/my-orders' }
              ].map((link) =>
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer-link">
                    <span className="text-[10px] text-accent/60">•</span>
                    {link.label}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Corporate */}
          <div className="footer-column flex flex-col">
            <h2 className="footer-heading">Corporate</h2>
            <ul className="list-none p-0 m-0 space-y-1">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Warranty & Returns', href: '/warranty' },
                { label: 'Shipping Policy', href: '/warranty' },
                { label: 'FAQs', href: '/faqs' }
              ].map((link) =>
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer-link">
                    <span className="text-[10px] text-accent/60">•</span>
                    {link.label}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 5: Our Location */}
          <div className="footer-column flex flex-col lg:col-span-1">
            <h2 className="footer-heading">Our Location</h2>
            <div className="w-full h-[140px] border border-white/5 overflow-hidden shadow-2xl bg-[#000]/40 rounded-sm group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.319431366537!2d74.3405693746962!3d31.51538554738996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904591c5de257%3A0xe0409258a61a2dd4!2sHafeez%20Center!5e0!3m2!1sen!2s!4v1756732465975!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps: Lapzen Location"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0">
              </iframe>
            </div>
          </div>

          {/* Column 6: Follow Us */}
          <div className="footer-column flex flex-col">
            <h2 className="footer-heading">Follow Us</h2>
            <div className="flex items-center gap-[12px]">
              <a
                href="https://web.facebook.com/lap.lapzen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-accent hover:text-white hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Facebook">
                <Facebook size={18} fill="currentColor" strokeWidth={0} />
              </a>
              <a
                href="https://www.instagram.com/lapzenstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-accent hover:text-white hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a
                href="https://x.com/lapzenstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-accent hover:text-white hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Twitter">
                <Twitter size={18} fill="currentColor" strokeWidth={0} />
              </a>
            </div>
          </div>
        </div>

        <div className="mb-10 opacity-40 hover:opacity-100 transition-opacity duration-300">
          <div className="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="695e459fe66451fcf34cb871" data-style-height="52px" data-style-width="100%" data-token="304a56bc-adad-479a-b594-a77d80dc8fdd">
            <a href="https://www.trustpilot.com/review/lapzen.shop" target="_blank" rel="noopener" className="text-[12px]">Trustpilot Review</a>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/40">
          <p className="font-medium tracking-wide">© {new Date().getFullYear()} Lapzen | Premium Laptop Store. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* WhatsApp Sticky Floating Icon */}
      <a
        href="https://wa.me/923090009022"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[24px] right-[24px] z-[50] bg-[#25D366] text-white p-[14px] rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        aria-label="Chat on WhatsApp">
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="drop-shadow-sm group-hover:drop-shadow-md">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
};

export default FooterSection;
