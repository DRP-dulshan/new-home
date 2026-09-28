import Link from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  external?: boolean;
  children: ReactNode;
};

/**
 * Renders a next/link for internal routes and a safe <a> for external ones.
 * Anchors (#contact) stay as plain <a> so smooth scrolling works.
 * Forwards refs so the header can drive keyboard focus.
 */
const SmartLink = forwardRef<HTMLAnchorElement, Props>(function SmartLink(
  { href, external, children, ...rest },
  ref,
) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const isAnchor = href.startsWith('#');

  if (isExternal) {
    return (
      <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  if (isAnchor) {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} {...rest}>
      {children}
    </Link>
  );
});

export default SmartLink;
