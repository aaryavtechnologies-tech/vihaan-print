import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need to install any software?",
    answer: "No, VIHAAN ID PRINT is 100% cloud-based. You can access the platform from any modern web browser on Windows, Mac, or Linux without installing any local applications."
  },
  {
    question: "Can I import students from our existing ERP?",
    answer: "Yes, you can easily export data from your existing school ERP or MIS system to an Excel or CSV file and use our Bulk Import tool to add thousands of students in seconds."
  },
  {
    question: "What kind of printers are supported?",
    answer: "Our system generates high-resolution, print-ready PDF files formatted exactly to standard CR80 card dimensions. This means it works flawlessly with any standard PVC card printer (Zebra, Fargo, Evolis, Magicard, etc.)."
  },
  {
    question: "Is student data secure?",
    answer: "Security is our top priority. All student data and photos are encrypted in transit and at rest. We use enterprise-grade cloud infrastructure with daily backups and role-based access control."
  },
  {
    question: "Can we create multiple templates for different grades?",
    answer: "Absolutely! You can create unlimited templates using our drag-and-drop editor. Assign different templates for students, staff, different grades, or different school branches."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>

        {/* @ts-ignore */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
