import { Helmet } from "react-helmet-async"

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterHandle?: string
}

export default function SEO({
  title,
  description = "Openlead Academy - Empowering your future through quality education and professional training.",
  canonical = "https://openlead.academy",
  ogImage = "https://openlead.academy/og-image.png",
  ogType = "website",
  twitterHandle = "@openleadacademy",
}: SEOProps) {
  const siteTitle = title ? `${title} | Openlead Academy` : "Openlead Academy"

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#14B8A6" />
    </Helmet>
  )
}
