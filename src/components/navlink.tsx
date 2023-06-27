import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FComp } from '@/types/common';

type NavLinkProps = {
  href: string;
};

const NavLink: FComp<NavLinkProps> = ({ href, className, children }) => {
  const pathname = usePathname();

  if (pathname === href) {
    className = `${className} no-underline text-lt-primary-darkest dark:text-dk-primary current-link`;
  }

  return (
    <Link href={href} legacyBehavior>
      <a className={className}>{children}</a>
    </Link>
  );
};

export default NavLink;
