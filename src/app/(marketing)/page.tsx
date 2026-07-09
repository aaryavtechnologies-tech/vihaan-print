import { HeroSection } from "@/components/marketing/hero-section";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQSection } from "@/components/marketing/faq-section";
import { CTASection } from "@/components/marketing/cta-section";
import { IdCardPreview } from "@/components/marketing/id-card-preview";

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <TrustedBy />
      <FeaturesSection />
      <HowItWorks />
      
      <section className="py-24 bg-slate-900 overflow-hidden border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-1/4 top-0 h-[300px] w-[400px] rounded-full bg-blue-600/10 blur-[100px] -z-0" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">Stunning ID Cards, instantly.</h2>
                 <p className="text-lg text-slate-300 mb-8">
                    Our platform renders high-resolution ID cards that look incredible on screen and print perfectly on PVC. Hover or tap the card to see the back side.
                 </p>
                 <ul className="space-y-4 mb-8 text-slate-200">
                    <li className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/30">1</div>
                       <span>High-resolution 300 DPI output ready for print</span>
                    </li>
                    <li className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/30">2</div>
                       <span>Customizable edge-to-edge template designs</span>
                    </li>
                    <li className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/30">3</div>
                       <span>Automatic barcode & QR code generation</span>
                    </li>
                 </ul>
              </div>
              <div className="lg:w-1/2 w-full flex justify-center py-10">
                 <IdCardPreview />
              </div>
           </div>
        </div>
      </section>

      <BenefitsSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
