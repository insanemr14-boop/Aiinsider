/**
 * JSON-LD builders.
 *
 * Every graph node is given a stable `@id` so that Google can resolve the
 * relationships between Organization, WebSite, WebPage and Article rather than
 * treating each block as an unconnected island. This is the difference between
 * "we have schema" and schema that actually earns rich results.
 */

import { SITE } from '../config/site.config';
import type { Author } from '../config/authors';
import type { Category } from '../config/categories';

const abs = (path: string) => new URL(path, SITE.url).toString();

/** Stable graph identifiers. */
export const ID = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  page: (path: string) => `${abs(path)}#webpage`,
  article: (path: string) => `${abs(path)}#article`,
  author: (slug: string) => `${SITE.url}/authors/${slug}/#author`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
};

export function organizationSchema() {
  const org = SITE.organization;

  return {
    '@type': 'Organization',
    '@id': ID.organization,
    name: org.legalName,
    alternateName: SITE.shortName,
    url: SITE.url,
    description: SITE.description,
    foundingDate: String(org.foundingYear),
    email: org.email,
    ...(org.telephone && { telephone: org.telephone }),
    ...(org.operatedBy && {
      parentOrganization: { '@type': 'Organization', name: org.operatedBy },
    }),
    ...(org.address && {
      address: {
        '@type': 'PostalAddress',
        ...(org.address.street && { streetAddress: org.address.street }),
        addressLocality: org.address.locality,
        ...(org.address.region && { addressRegion: org.address.region }),
        ...(org.address.postalCode && { postalCode: org.address.postalCode }),
        addressCountry: org.address.country,
      },
    }),
    // A contactPoint is what Google reads for the "Contact" action; the bare
    // email/telephone fields above are not enough on their own.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: org.email,
      ...(org.telephone && { telephone: org.telephone }),
      ...(org.hours && { hoursAvailable: org.hours }),
      availableLanguage: ['English'],
      url: `${SITE.url}/contact/`,
    },
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE.url}/#logo`,
      url: abs(org.logoPath),
      contentUrl: abs(org.logoPath),
      caption: SITE.name,
    },
    image: { '@id': `${SITE.url}/#logo` },
    sameAs: [
      SITE.social.twitter,
      SITE.social.github,
      SITE.social.linkedin,
      SITE.social.instagram,
    ].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ID.organization },
    inLanguage: SITE.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageSchema(opts: {
  path: string;
  title: string;
  description: string;
  breadcrumbPath?: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': ID.page(opts.path),
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': ID.website },
    inLanguage: SITE.language,
    ...(opts.breadcrumbPath && {
      breadcrumb: { '@id': ID.breadcrumb(opts.breadcrumbPath) },
    }),
  };
}

export function authorSchema(author: Author) {
  return {
    '@type': author.type,
    '@id': ID.author(author.slug),
    name: author.name,
    description: author.bio,
    url: `${SITE.url}/authors/${author.slug}/`,
    ...(author.type === 'Person' && { jobTitle: author.role }),
    ...(author.social?.twitter || author.social?.linkedin || author.social?.github
      ? {
          sameAs: [
            author.social?.twitter,
            author.social?.linkedin,
            author.social?.github,
          ].filter(Boolean),
        }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(path: string, items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.href),
    })),
  };
}

export function articleSchema(opts: {
  path: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  author: Author;
  category: Category;
  tags: string[];
  image: string;
  wordCount?: number;
  type: 'news' | 'guide' | 'review' | 'comparison' | 'analysis';
}) {
  // Map internal content types onto the most specific schema.org type that
  // Google recognises. NewsArticle unlocks Top Stories eligibility.
  // Comparisons stay `Article`: schema.org has no comparison type, and
  // misusing Review/Product here would be a structured-data violation.
  const schemaType =
    opts.type === 'news'
      ? 'NewsArticle'
      : opts.type === 'guide'
        ? 'TechArticle'
        : 'Article';

  return {
    '@type': schemaType,
    '@id': ID.article(opts.path),
    isPartOf: { '@id': ID.page(opts.path) },
    mainEntityOfPage: { '@id': ID.page(opts.path) },
    headline: opts.title.slice(0, 110),
    name: opts.title,
    description: opts.description,
    datePublished: opts.publishDate.toISOString(),
    dateModified: (opts.updatedDate ?? opts.publishDate).toISOString(),
    author: { '@id': ID.author(opts.author.slug) },
    publisher: { '@id': ID.organization },
    articleSection: opts.category.name,
    keywords: opts.tags.join(', '),
    inLanguage: SITE.language,
    ...(opts.wordCount && { wordCount: opts.wordCount }),
    image: {
      '@type': 'ImageObject',
      url: abs(opts.image),
      width: 1200,
      height: 630,
    },
    thumbnailUrl: abs(opts.image),
  };
}

export function faqSchema(
  path: string,
  faq: { question: string; answer: string }[]
) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function collectionPageSchema(opts: {
  path: string;
  title: string;
  description: string;
  items: { name: string; href: string }[];
}) {
  return {
    '@type': 'CollectionPage',
    '@id': ID.page(opts.path),
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': ID.website },
    inLanguage: SITE.language,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: abs(item.href),
      })),
    },
  };
}

/**
 * SoftwareApplication node for a directory entry (AI tool or AI agent).
 *
 * `aggregateRating` is deliberately omitted: Google requires aggregate ratings
 * to represent multiple independent reviews, and ours is a single editorial
 * score. It is emitted as a `Review` with our Organization as author instead,
 * which is both accurate and rich-result eligible.
 */
export function softwareApplicationSchema(opts: {
  path: string;
  name: string;
  description: string;
  vendor: string;
  website: string;
  category: string;
  pricing: string;
  rating?: number;
  features: string[];
}) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${abs(opts.path)}#software`,
    name: opts.name,
    description: opts.description,
    url: opts.website,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: opts.category,
    operatingSystem: 'Web',
    author: { '@type': 'Organization', name: opts.vendor },
    featureList: opts.features,
    offers: {
      '@type': 'Offer',
      // Price is intentionally unset — vendor pricing changes constantly and a
      // stale figure in structured data is worse than none at all.
      category: opts.pricing,
availability: 'https://schema.org/InStock',
    },
    ...(opts.rating !== undefined && {
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: opts.rating,
          bestRating: 5,
          worstRating: 0,
        },
        author: { '@id': ID.organization },
      },
    }),
    isPartOf: { '@id': ID.website },
  };
}

/**
 * HowTo node for a prompt-library entry. A prompt is genuinely a procedure —
 * substitute the variables, run against a model — so HowTo is the honest type.
 */
export function promptSchema(opts: {
  path: string;
  title: string;
  description: string;
  variables: string[];
}) {
  return {
    '@type': 'HowTo',
    '@id': `${abs(opts.path)}#howto`,
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': ID.website },
    inLanguage: SITE.language,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Copy the prompt',
        text: 'Copy the full prompt template from this page.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Replace the variables',
        text: opts.variables.length
          ? `Replace each placeholder with your own values: ${opts.variables.join(', ')}.`
          : 'Adjust the bracketed placeholders to match your own context.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Run and refine',
        text: 'Send the prompt to your model of choice, then iterate on the constraints if the output misses the mark.',
      },
    ],
  };
}

/** Wraps nodes into a single connected @graph document. */
export function graph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}
