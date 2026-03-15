export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationWebSiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodrush.pk';
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'FoodRush PK',
        url: siteUrl,
        logo: `${siteUrl}/foodrush-pk-logo.svg`,
        description: 'Fresh food delivered fast across Pakistan. Built by Nexora Labs.'
      },
      {
        '@type': 'WebSite',
        name: 'FoodRush PK',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/menu?search={search_term_string}` },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
  return <JsonLd data={data} />;
}
