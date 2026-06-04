import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { updateAnalyticsConsent } from '../../utils/analytics';

export const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(() => {
    // Check if user already consented
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('cookie_consent');
    }
    return true;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    updateAnalyticsConsent(true);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consent = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    updateAnalyticsConsent(false);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    updateAnalyticsConsent(Boolean(consent.analytics));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-indigo-600 shadow-2xl z-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {!showSettings ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  🍪 Cookie & Privacy Settings
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  We use cookies to enhance your experience, analyze usage, and deliver personalized content. Essential cookies are always active.
                </p>
                <p className="text-xs text-gray-500">
                  Read our&nbsp;
                  <a href="/cookies" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Cookie Policy</a>&nbsp;and&nbsp;
                  <a href="/privacy" className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Privacy Policy</a>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 flex-shrink-0">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                  Reject
                </button>

                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                >
                  Manage
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: '#4f46e5' }}
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            /* Settings Panel */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Cookie Preferences</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  aria-label="Close cookie preferences"
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {/* Essential */}
                <label className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg cursor-not-allowed">
                  <input type="checkbox" checked={true} disabled className="mt-1 accent-indigo-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Essential Cookies ✓ (Always Active)</p>
                    <p className="text-sm text-gray-600 mt-1">Required for authentication and security. Cannot be disabled.</p>
                  </div>
                </label>

                {/* Functional */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="mt-1 accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Functional Cookies</p>
                    <p className="text-sm text-gray-600 mt-1">Remember your preferences and settings for a better experience.</p>
                  </div>
                </label>

                {/* Analytics */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="mt-1 accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Analytics Cookies</p>
                    <p className="text-sm text-gray-600 mt-1">Help us understand how you use the Platform to improve features.</p>
                  </div>
                </label>

                {/* Marketing */}
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="mt-1 accent-indigo-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Marketing Cookies</p>
                    <p className="text-sm text-gray-600 mt-1">Show you relevant ads and measure advertising effectiveness.</p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                  Reject All
                </button>

                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: '#7c3aed' }}
                >
                  Save Preferences
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ background: '#4f46e5' }}
                >
                  <Check size={16} /> Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default CookieConsentBanner;
