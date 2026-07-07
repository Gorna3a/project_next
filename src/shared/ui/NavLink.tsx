'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children?: ReactNode | ((props: { isActive: boolean }) => ReactNode);
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
}

export const NavLink = ({ href, children, className, end }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = end ? pathname === href : pathname.startsWith(href);

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  const resolvedChildren =
    typeof children === "function" ? children({ isActive }) : children;

  return (
    <Link href={href} className={resolvedClassName}>
      {resolvedChildren}
    </Link>
  );
};
