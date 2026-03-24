const MEASUREMENT_ID = "G-MD0PRVGGWD";

const getMeasurementId = () =>
  (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim() || MEASUREMENT_ID;

let initialized = false;

const ensureAnalyticsScript = (measurementId) => {
  if (typeof window === "undefined" || initialized || !measurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
  });

  window.gtag("config", measurementId, { send_page_view: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.setAttribute("data-xalora-analytics", "true");
  document.head.appendChild(script);

  initialized = true;
};

export const updateAnalyticsConsent = (allowAnalytics) => {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: allowAnalytics ? "granted" : "denied",
    ad_storage: "denied",
  });
};

export const initializeAnalytics = () => {
  const measurementId = getMeasurementId();
  ensureAnalyticsScript(measurementId);
};

export const isAnalyticsAllowed = () => true;

export const trackPageView = (path) => {
  if (typeof window === "undefined" || !window.gtag) return;
  const measurementId = getMeasurementId();

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
    send_to: measurementId,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
};
