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
      
      <section className="py-24 bg-slate-100 dark:bg-slate-900 overflow-hidden border-t">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Stunning ID Cards, instantly.</h2>
                 <p className="text-lg text-muted-foreground mb-8">
                    Our platform renders high-resolution ID cards that look incredible on screen and print perfectly on PVC. Hover or tap the card to see the back side.
                 </p>
                 <ul className="space-y-4 mb-8 text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                       <span>High-resolution 300 DPI output ready for print</span>
                    </li>
                    <li className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                       <span>Customizable edge-to-edge template designs</span>
                    </li>
                    <li className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">3</div>
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
