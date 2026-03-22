import { useEffect } from "react";
import SEO_CONFIG, { generateMetaTags } from "../config/seo-config";

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
 *       {/* Your page content *\/}
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

const SEO = ({ pageKey = "home", custom = {}, structuredData = [] }) => {
  const metaTags = generateMetaTags(pageKey, custom);
  const { site } = SEO_CONFIG;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const ensureMeta = (attr, key, value) => {
      if (!value) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        el.setAttribute("data-xalora-seo", "true");
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    const ensureLink = (rel, href) => {
      if (!href) return;
      let el = document.head.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        el.setAttribute("data-xalora-seo", "true");
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    document.title = metaTags.title;

    ensureMeta("name", "title", metaTags.title);
    ensureMeta("name", "description", metaTags.description);
    ensureMeta("name", "keywords", metaTags.keywords);
    ensureMeta("name", "author", metaTags.author);
    ensureMeta("name", "robots", metaTags.robots);
    ensureMeta("name", "googlebot", metaTags.robots);
    ensureMeta("name", "language", site.language);
    ensureMeta("name", "theme-color", metaTags.themeColor);

    ensureMeta("property", "og:type", metaTags.ogType);
    ensureMeta("property", "og:url", metaTags.ogUrl);
    ensureMeta("property", "og:title", metaTags.ogTitle);
    ensureMeta("property", "og:description", metaTags.ogDescription);
    ensureMeta("property", "og:image", metaTags.ogImage);
    ensureMeta("property", "og:site_name", metaTags.ogSiteName);
    ensureMeta("property", "og:locale", metaTags.ogLocale);

    ensureMeta("name", "twitter:card", metaTags.twitterCard);
    ensureMeta("name", "twitter:site", metaTags.twitterSite);
    ensureMeta("name", "twitter:creator", metaTags.twitterCreator);
    ensureMeta("name", "twitter:title", metaTags.twitterTitle);
    ensureMeta("name", "twitter:description", metaTags.twitterDescription);
    ensureMeta("name", "twitter:image", metaTags.twitterImage);

    ensureLink("canonical", metaTags.canonical);

    const oldStructured = document.head.querySelectorAll(
      'script[type="application/ld+json"][data-xalora-seo="true"]'
    );
    oldStructured.forEach((node) => node.remove());

    const schemas = [];
    if (metaTags.structuredData) schemas.push(metaTags.structuredData);
    structuredData.forEach((item) => schemas.push(item));

    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-xalora-seo", "true");
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [metaTags, site.language, structuredData]);

  return null;
};

export default SEO;
