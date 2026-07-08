import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Generated Cards | VIHAAN ID PRINT",
};

export default async function GeneratedCardsPage() {
  const cards = await prisma.generatedCard.findMany({
    orderBy: { generatedAt: "desc" },
    include: {
      school: true,
      student: true,
      template: true,
    },
    take: 50
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Generated Cards</h1>
          <p className="text-slate-500 font-medium mt-1.5">
            View, download, and manage your successfully generated ID cards.
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md h-11 px-6">
            Generate More
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cards.map(card => (
          <Link key={card.id} href={`/dashboard/generated-cards/${card.id}`} className="group">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[0.63] relative bg-slate-100">
                {card.thumbnail ? (
                  <Image src={card.thumbnail} alt="Card Front" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Preview</div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge className="bg-white/90 text-slate-900 border-none shadow-sm backdrop-blur-sm hover:bg-white/90">
                    {card.status}
                  </Badge>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{card.student.fullName}</h3>
                <p className="text-xs text-slate-500 mt-1">{card.school.schoolName}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(new Date(card.generatedAt))} ago</p>
              </div>
            </div>
          </Link>
        ))}
        {cards.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-3xl">
            No generated cards found. Go to the Generate tab to batch render ID cards.
          </div>
        )}
      </div>
    </div>
  );
}
