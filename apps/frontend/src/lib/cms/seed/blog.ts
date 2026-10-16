import { BLOG_COPY } from '@/lib/content/blog';
import type { SeedPart } from './types';

// "Halaman Blog" starts from the copy the public /blog pages render (lib/content/blog.ts).
export const seed: SeedPart = {
  sections: {
    'blog.hero': { ...BLOG_COPY.hero, topics: [...BLOG_COPY.hero.topics] },
    'blog.picks': { ...BLOG_COPY.picks, visible: true },
    'blog.archive': { ...BLOG_COPY.archive },
    'blog.write': {
      ...BLOG_COPY.write,
      wanted: [...BLOG_COPY.write.wanted],
      steps: BLOG_COPY.write.steps.map((s) => ({ ...s })),
      visible: true,
    },
    'blog.detail': { ...BLOG_COPY.detail },
  },
};
