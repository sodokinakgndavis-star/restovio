import { Skeleton } from "@/components/ui/skeleton";

export default function ChambresLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-5 w-40" />
      <Skeleton className="mt-6 h-32 w-full rounded-lg" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
