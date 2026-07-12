import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RoomPagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return `/chambres${query ? `?${query}` : ""}`;
  }

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="flex items-center justify-center gap-2">
      {isFirst ? (
        <Button variant="outline" size="sm" disabled>
          Précédent
        </Button>
      ) : (
        <Button variant="outline" size="sm" render={<Link href={buildHref(page - 1)} />}>
          Précédent
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        Page {page} sur {totalPages}
      </span>

      {isLast ? (
        <Button variant="outline" size="sm" disabled>
          Suivant
        </Button>
      ) : (
        <Button variant="outline" size="sm" render={<Link href={buildHref(page + 1)} />}>
          Suivant
        </Button>
      )}
    </div>
  );
}
