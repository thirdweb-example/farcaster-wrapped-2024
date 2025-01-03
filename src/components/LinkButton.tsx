import Link from "next/link";

export function LinkButton({ children, href, ...props }: React.ComponentPropsWithoutRef<"a"> & { href: string }) {
  return (
    <Link prefetch href={href} className="bg-foreground text-background rounded-full py-2 px-4 font-semibold flex justify-between items-center gap-1 group relative z-10 transition-all duration-200" {...props}>
      {children}
    </Link>
  );
}
