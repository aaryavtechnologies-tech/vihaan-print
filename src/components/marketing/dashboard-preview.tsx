export function DashboardPreview() {
  return (
    <div className="w-full aspect-[16/9] relative rounded-lg overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800" />
      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="h-10 w-full border-b bg-background/50 flex items-center px-4 gap-2">
           <div className="h-3 w-3 rounded-full bg-red-400" />
           <div className="h-3 w-3 rounded-full bg-amber-400" />
           <div className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 flex w-full">
           <div className="w-48 border-r bg-background/30 hidden md:block p-4 space-y-4">
              <div className="h-6 w-3/4 bg-muted-foreground/20 rounded" />
              <div className="h-4 w-full bg-muted-foreground/10 rounded" />
              <div className="h-4 w-5/6 bg-muted-foreground/10 rounded" />
              <div className="h-4 w-full bg-muted-foreground/10 rounded" />
           </div>
           <div className="flex-1 p-6 space-y-6">
              <div className="flex justify-between items-center">
                 <div className="h-8 w-1/3 bg-muted-foreground/20 rounded" />
                 <div className="h-8 w-24 bg-blue-500/80 rounded" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-background/50 rounded border border-border/50 p-4">
                       <div className="h-4 w-1/2 bg-muted-foreground/20 rounded mb-2" />
                       <div className="h-8 w-3/4 bg-muted-foreground/30 rounded" />
                    </div>
                 ))}
              </div>
              <div className="h-48 md:h-64 bg-background/50 rounded border border-border/50" />
           </div>
        </div>
      </div>
    </div>
  );
}
