"use client";

import { usePathname } from "@/i18n/navigation";

/**
 * Replays the entrance animation on every route change by keying the wrapper
 * on the pathname, so React remounts it and the CSS animation runs again.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
