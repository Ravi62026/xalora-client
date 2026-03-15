import React from 'react';
import { Helmet } from 'react-helmet-async';
import SEO_CONFIG, { generateMetaTags } from './seo-config';

/**
 * SEO Component for Xalora
 * 
 * USAGE:
 * import SEO from './components/SEO';
 * 
 * function HomePage() {
 *   return (
 *     <>
 *       <SEO pageKey="home" />
 *       {/* Your page content */}
 *     </>
 *   );
 * }
 * 
 * // With custom overrides:
 * <SEO 
 *   pageKey="ai-interview" 
 *   custom={{
 *     title: 'Custom Title',
 *     description: 'Custom description'
 *   }} 
 * />
 */

const SEO = ({ pageKey = 'home', custom = {}, structuredData = [] }) => {
  const metaTags = generateMetaTags(pageKey, custom);
  const { site } = SEO_CONFIG;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="title" content={metaTags.title} />
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="author" content={metaTags.author} />
      <meta name="robots" content={metaTags.robots} />
      <meta name="googlebot" content={metaTags.robots} />
      <meta name="language" content={site.language} />
      <meta name="theme-color" content={metaTags.themeColor} />

      {/* Canonical URL */}
      <link rel="canonical" href={metaTags.canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metaTags.ogType} />
      <meta property="og:url" content={metaTags.ogUrl} />
      <meta property="og:title" content={metaTags.ogTitle} />
      <meta property="og:description" content={metaTags.ogDescription} />
      <meta property="og:image" content={metaTags.ogImage} />
      <meta property="og:site_name" content={metaTags.ogSiteName} />
      <meta property="og:locale" content={metaTags.ogLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={metaTags.twitterCard} />
      <meta name="twitter:site" content={metaTags.twitterSite} />
      <meta name="twitter:creator" content={metaTags.twitterCreator} />
      <meta name="twitter:title" content={metaTags.twitterTitle} />
      <meta name="twitter:description" content={metaTags.twitterDescription} />
      <meta name="twitter:image" content={metaTags.twitterImage} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external resources */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data (JSON-LD) */}
      {metaTags.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(metaTags.structuredData)}
        </script>
      )}

      {/* Additional structured data if provided */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}

      {/* Google Site Verification (add your verification code) */}
      {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}

      {/* Bing Webmaster Tools (add your verification code) */}
      {/* <meta name="msvalidate.01" content="YOUR_VERIFICATION_CODE" /> */}
    </Helmet>
  );
};

export default SEO;
