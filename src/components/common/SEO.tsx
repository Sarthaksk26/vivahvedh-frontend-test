import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  url?: string;
  schema?: Record<string, any>;
}

export function SEO({
  title = 'Vivahvedh - Perfect Matchmaking',
  description = 'Join Vivahvedh today to find your perfect match. Secure, verified, and community-focused matchmaking service.',
  type = 'website',
  image = 'https://vivahvedh.com/logo.png',
  url = 'https://vivahvedh.com',
  schema,
}: SEOProps) {
  // Base Schema for the entire site (LocalBusiness/Organization)
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vivahvedh',
    url: 'https://vivahvedh.com',
    logo: 'https://vivahvedh.com/logo.png',
    description: description,
    sameAs: [
      // Add social links here if available
    ],
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
}
