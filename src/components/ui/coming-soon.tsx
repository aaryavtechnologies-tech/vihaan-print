import { cn } from "@/lib/utils";

interface ComingSoonProps {
  /** The module / feature name */
  module?: string;
  /** A short description of what the module will do */
  description?: string;
  /** Which features are planned — displayed as pills */
  features?: string[];
  /** Optional extra className on the wrapper */
  className?: string;
}

/**
 * Drop-in placeholder for pages / features that are not yet built.
 *
 * Usage:
 *   import { ComingSoon } from "@/components/ui/coming-soon";
 *   export default function ReportsPage() {
 *     return <ComingSoon module="Reports" />;
 *   }
 */
export function ComingSoon({
  module = "This Module",
  description = "We're working hard to bring this feature to you. Stay tuned!",
  features = [],
  className,
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[70vh] overflow-hidden rounded-3xl select-none",
        className
      )}
    >
      {/* ── Animated gradient backdrop ── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #e0eaff 0%, #f8faff 60%, #ffffff 100%)",
        }}
      />

      {/* ── Decorative floating rings ── */}
      <div
        aria-hidden
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-blue-200/60 pointer-events-none animate-spin"
        style={{ animationDuration: "30s" }}
      />
      <div
        aria-hidden
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full border border-indigo-200/50 pointer-events-none animate-spin"
        style={{ animationDuration: "20s", animationDirection: "reverse" }}
      />

      {/* ── Blurred blobs ── */}
      <div
        aria-hidden
        className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* ── Main card ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-14 max-w-lg w-full">
        {/* Icon */}
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl scale-150" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
            {/* Rocket SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-11 h-11"
              aria-hidden
            >
              <path d="M12 2C12 2 7 6 7 12L12 22L17 12C17 6 12 2 12 2Z" />
              <path d="M7 12C5 12 3 14 3 16L7 15" />
              <path d="M17 12C19 12 21 14 21 16L17 15" />
              <circle cx="12" cy="11" r="2" fill="white" stroke="none" />
            </svg>
          </div>

          {/* Orbiting dot */}
          <span
            className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"
            style={{
              animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-blue-100 text-blue-700 border border-blue-200 mb-5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-blue-500"
            style={{ animation: "pulse 1.5s ease-in-out infinite" }}
          />
          Coming Soon
        </span>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 leading-tight">
          {module}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            is on its way!
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-sm">
          {description}
        </p>

        {/* Planned features pills */}
        {features.length > 0 && (
          <div className="w-full mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Planned features
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Development progress</span>
            <span className="font-semibold text-blue-600">In progress…</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{
                width: "60%",
                animation: "shimmer 2.5s linear infinite",
                background:
                  "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #3b82f6 100%)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Shimmer keyframe via inline style tag */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
