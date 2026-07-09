"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Principal, Delhi Public School",
    content: "VIHAAN ID PRINT revolutionized our admission season. We generated over 2,000 ID cards in a single afternoon without a single crash. Absolutely phenomenal platform.",
    initials: "RK",
    color: "bg-orange-500",
  },
  {
    name: "Priya Sharma",
    role: "Admin Coordinator, Ryan International",
    content: "The drag-and-drop template editor is a lifesaver. We completely redesigned our staff and student IDs in under an hour. The interface is incredibly intuitive.",
    initials: "PS",
    color: "bg-blue-500",
  },
  {
    name: "Amit Patel",
    role: "IT Director, Kendriya Vidyalaya",
    content: "Managing multiple branches used to be a nightmare with desktop software. The multi-tenant cloud architecture of VIHAAN is exactly the enterprise solution we needed.",
    initials: "AP",
    color: "bg-emerald-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-950 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Don't just take our word for it</h2>
          <p className="text-lg text-slate-400">
            Thousands of educational institutions trust VIHAAN to handle their sensitive student data and card generation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/4 backdrop-blur-sm rounded-2xl p-8 border border-white/8 flex flex-col justify-between hover:bg-white/7 hover:border-white/15 transition-all"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
