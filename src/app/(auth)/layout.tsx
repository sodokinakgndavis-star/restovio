import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Image src="/logo-mark.png" alt="Restovio" width={32} height={32} className="h-8 w-8" />
        <span className="font-heading text-xl font-semibold tracking-wide">Restovio</span>
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border/60 bg-background p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
