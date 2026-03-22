const CONSENT_KEY = "cookie_consent";
const DEFAULT_MEASUREMENT_ID = "G-XXXXXXXXXX";

const getMeasurementId = () =>
  (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim() || DEFAULT_MEASUREMENT_ID;

const getConsent = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAnalyticsAllowed = () => Boolean(getConsent()?.analytics);

const ensureAnalyticsScript = (measurementId) => {
  if (typeof window === "undefined" || window.gtag || !measurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.setAttribute("data-xalora-analytics", "true");
  document.head.appendChild(script);
};

export const updateAnalyticsConsent = (allowAnalytics) => {
  const measurementId = getMeasurementId();
  if (measurementId === DEFAULT_MEASUREMENT_ID) return;

  ensureAnalyticsScript(measurementId);
  if (!window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: allowAnalytics ? "granted" : "denied",
    ad_storage: "denied",
  });

  if (allowAnalytics) {
    window.gtag("config", measurementId, { send_page_view: false });
  }
};

export const initializeAnalytics = () => {
  const consent = isAnalyticsAllowed();
  updateAnalyticsConsent(consent);
};

export const trackPageView = (path) => {
  if (!isAnalyticsAllowed() || typeof window === "undefined" || !window.gtag) return;
  const measurementId = getMeasurementId();
  if (!measurementId || measurementId === DEFAULT_MEASUREMENT_ID) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
    send_to: measurementId,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!isAnalyticsAllowed() || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
};
