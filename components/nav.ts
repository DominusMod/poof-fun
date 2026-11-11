import type { DocMeta } from '@/lib/docs';

export interface MenuLink {
  href: string;
  label: string;
}

export interface MenuSection {
  title: string;
  links: MenuLink[];
}

/**
 * Everything that lives inside the menu button.
 * Header Explore/Launch shortcuts and footer links reference these
 * so routes are defined once.
 */
export const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Portfolio',
    links: [
      { href: '/portfolio/holdings', label: 'Holdings' },
      { href: '/portfolio/rewards', label: 'Rewards' },
    ],
  },
  {
    title: 'Launch',
    links: [
      { href: '/launch/create', label: 'New narrative' },
      { href: '/launch/mine', label: 'My launches' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { href: '/discover/trending', label: 'Trending' },
      { href: '/discover/new', label: 'New' },
      { href: '/discover/top', label: 'Top' },
    ],
  },
];

export function docsMenuSection(docs: DocMeta[]): MenuSection {
  return {
    title: 'Docs',
    links: docs.map((d) => ({
      href: d.slug === 'introduction' ? '/docs' : `/docs/${d.slug}`,
      label: d.title,
    })),
  };
}
