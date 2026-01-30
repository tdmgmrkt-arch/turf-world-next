import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/60",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-white p-6 shadow-lg", className)}>
      <Skeleton className="h-40 w-full rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonProductGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6 rounded-full bg-white/10" />
          <Skeleton className="h-16 md:h-20 w-full max-w-2xl mx-auto mb-6 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto mb-4 bg-white/10" />
          <Skeleton className="h-6 w-3/4 max-w-lg mx-auto bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function SkeletonForm() {
  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-lg space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonProductGrid, SkeletonHero, SkeletonForm };
