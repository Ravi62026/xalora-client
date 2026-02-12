import React from 'react';
import { LegalLayout, Section, SubSection, ListItem, Table } from './LegalLayout';

export const CookiePolicy = () => {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="How we use cookies and tracking technologies"
    >
      <Section title="1. Introduction">
        <p>
          This Cookie Policy explains how Xalora uses cookies and similar tracking technologies on our website and applications (the "Platform").
        </p>
        <p>
          Cookies are small text files stored on your device that help us remember information about your visit and improve your experience.
        </p>
      </Section>

      <Section title="2. What Are Cookies?">
        <SubSection title="2.1 Definition">
          <p className="text-gray-700">
            A cookie is a small piece of data stored on your device by your web browser. Cookies can store login information, track browsing behavior, remember user preferences, measure website performance, and serve relevant advertising.
          </p>
        </SubSection>

        <SubSection title="2.2 Types of Cookies">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">By Duration:</p>
              <ul className="space-y-1">
                <ListItem><strong>Session Cookies:</strong> Deleted when you close browser</ListItem>
                <ListItem><strong>Persistent Cookies:</strong> Remain until expiration or manual deletion</ListItem>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800">By Purpose:</p>
              <ul className="space-y-1">
                <ListItem><strong>Essential:</strong> Required for functionality</ListItem>
                <ListItem><strong>Functional:</strong> Enhance user experience</ListItem>
                <ListItem><strong>Analytics:</strong> Measure usage and performance</ListItem>
                <ListItem><strong>Marketing:</strong> Deliver targeted ads</ListItem>
              </ul>
            </div>
          </div>
        </SubSection>
      </Section>

      <Section title="3. Cookies We Use">
        <SubSection title="3.1 Essential Cookies (Required - No Consent Needed)">
          <Table
            headers={['Cookie Name', 'Purpose', 'Duration', 'Provider']}
            rows={[
              ['session_id', 'Authentication & session', 'Until logout', 'Xalora'],
              ['auth_token', 'JWT authentication', '24 hours', 'Xalora'],
              ['csrf_token', 'CSRF protection', '24 hours', 'Xalora'],
              ['cookie_consent', 'Store preferences', '1 year', 'Xalora'],
              ['lang_preference', 'Language selection', '1 year', 'Xalora'],
              ['theme_mode', 'Light/dark mode', '1 year', 'Xalora'],
              ['cf_clearance', 'Cloudflare security', '30 minutes', 'Cloudflare'],
            ]}
          />
          <p className="text-sm text-gray-600 mt-4">
            <strong>Note:</strong> Essential cookies are ALWAYS active regardless of consent.
          </p>
        </SubSection>

        <SubSection title="3.2 Functional Cookies (Consent Recommended)">
          <Table
            headers={['Cookie Name', 'Purpose', 'Duration', 'Provider']}
            rows={[
              ['last_visited_page', 'Remember last page', '7 days', 'Xalora'],
              ['font_size_preference', 'Accessibility setting', '1 year', 'Xalora'],
              ['code_editor_settings', 'Editor configuration', '1 year', 'Xalora'],
              ['notification_preferences', 'Notification settings', '1 year', 'Xalora'],
              ['search_history', 'Recent searches', '30 days', 'Xalora'],
              ['filter_preferences', 'Active filters', '30 days', 'Xalora'],
            ]}
          />
          <p className="text-sm text-gray-600 mt-4">
            Enhance your experience by remembering preferences without requiring login.
          </p>
        </SubSection>

        <SubSection title="3.3 Analytics Cookies (Requires Consent)">
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-600 pl-4">
              <p className="font-semibold text-gray-800">Google Analytics 4</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purpose:</strong> Analyze user behavior, page views, session duration<br/>
                <strong>Duration:</strong> 26 months<br/>
                <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-indigo-600 hover:underline">https://policies.google.com/privacy</a><br/>
                <strong>Opt-Out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-indigo-600 hover:underline">Google Analytics Opt-Out</a>
              </p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4">
              <p className="font-semibold text-gray-800">Mixpanel Analytics</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purpose:</strong> User behavior analytics, feature usage<br/>
                <strong>Duration:</strong> 5 years<br/>
                <strong>Privacy Policy:</strong> <a href="https://mixpanel.com/legal/privacy-policy" className="text-indigo-600 hover:underline">https://mixpanel.com/legal/privacy-policy</a>
              </p>
            </div>

            <div className="border-l-4 border-indigo-600 pl-4">
              <p className="font-semibold text-gray-800">Hotjar Session Recording (Optional)</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purpose:</strong> Session replay, heatmaps, user behavior<br/>
                <strong>Duration:</strong> 1 year<br/>
                <strong>Privacy Policy:</strong> <a href="https://www.hotjar.com/policies/privacy" className="text-indigo-600 hover:underline">https://www.hotjar.com/policies/privacy</a><br/>
                <strong>Opt-Out:</strong> <a href="https://www.hotjar.com/opt-out" className="text-indigo-600 hover:underline">Hotjar Opt-Out</a>
              </p>
            </div>
          </div>
        </SubSection>

        <SubSection title="3.4 Marketing/Advertising Cookies (Requires Consent)">
          <div className="space-y-4">
            <div className="border-l-4 border-green-600 pl-4">
              <p className="font-semibold text-gray-800">Google Ads Conversion Tracking</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purpose:</strong> Track conversions, ad retargeting<br/>
                <strong>Duration:</strong> 90 days<br/>
                <strong>Provider:</strong> Google LLC (USA)
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <p className="font-semibold text-gray-800">Facebook Pixel</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purpose:</strong> Track visits, build audiences<br/>
                <strong>Duration:</strong> 1-3 months<br/>
                <strong>Provider:</strong> Meta Platforms (USA)
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <p className="font-semibold text-gray-800">LinkedIn Insight Tag</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Purpose:</strong> Track conversions, build audiences<br/>
                <strong>Duration:</strong> 1-12 months<br/>
                <strong>Provider:</strong> LinkedIn Corporation (USA)
              </p>
            </div>
          </div>
        </SubSection>
      </Section>

      <Section title="4. How We Use Cookies">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Essential Functions</p>
            <p className="text-gray-700">Keep you logged in, protect against CSRF attacks, load pages quickly, maintain session information</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">User Experience</p>
            <p className="text-gray-700">Remember preferences (theme, language), restore editor settings, show relevant content faster</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Analytics & Improvement</p>
            <p className="text-gray-700">Understand usage patterns, identify features people use, track page performance, conduct A/B testing</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Marketing & Advertising</p>
            <p className="text-gray-700">Show relevant ads, measure campaign effectiveness, build audiences, personalize experience</p>
          </div>
        </div>
      </Section>

      <Section title="5. Cookie Consent Management">
        <SubSection title="5.1 Consent Banner">
          <ul className="space-y-1">
            <ListItem>Appears on first visit to the Platform</ListItem>
            <ListItem>Can't be dismissed without making a choice (except essential)</ListItem>
            <ListItem>Consent preference stored in cookie (valid 1 year)</ListItem>
            <ListItem>Can't refuse essential cookies (required for login)</ListItem>
          </ul>
        </SubSection>

        <SubSection title="5.2 Consent Options">
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-gray-800">"Accept All"</p>
              <p className="text-gray-700 text-sm">Accept all non-essential cookies (analytics, marketing, tracking)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">"Reject All"</p>
              <p className="text-gray-700 text-sm">Reject all non-essential cookies. Only essential cookies active.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">"Manage Preferences"</p>
              <p className="text-gray-700 text-sm">Selectively enable/disable cookie categories</p>
            </div>
          </div>
        </SubSection>

        <SubSection title="5.3 Changing Your Preferences">
          <ul className="space-y-1">
            <ListItem>Access settings anytime in Account &gt; Privacy Settings</ListItem>
            <ListItem>Or click "Cookie Preferences" link in footer</ListItem>
            <ListItem>Changes take effect immediately</ListItem>
            <ListItem>Preference stored for future visits</ListItem>
          </ul>
        </SubSection>

        <SubSection title="5.4 Withdrawing Consent">
          <ul className="space-y-1">
            <ListItem>You can withdraw consent anytime</ListItem>
            <ListItem>Revisit cookie preferences in settings</ListItem>
            <ListItem>Disable previously enabled categories</ListItem>
            <ListItem>No penalties for withdrawing consent</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="6. Do-Not-Track Signals">
        <p>
          Some browsers include "Do Not Track" (DNT) feature. When DNT enabled, we don't store analytics/marketing cookies. Essential cookies still active (required).
        </p>
        <p className="mt-3">
          <strong>To Enable DNT:</strong><br/>
          Chrome: Settings &gt; Privacy &gt; Do Not Track<br/>
          Firefox: Settings &gt; Privacy &gt; Enhanced Tracking Protection<br/>
          Safari: Develop &gt; Enable Private Browsing
        </p>
      </Section>

      <Section title="7. Deleting Cookies">
        <SubSection title="7.1 How to Delete Cookies Manually">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">Chrome/Edge:</p>
              <p className="text-sm text-gray-700">Settings &gt; Privacy &amp; Security &gt; Delete browsing data &gt; "Cookies and other site data"</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Firefox:</p>
              <p className="text-sm text-gray-700">Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data &gt; Click "Clear All"</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Safari:</p>
              <p className="text-sm text-gray-700">Preferences &gt; Privacy &gt; Manage Website Data &gt; Remove All</p>
            </div>
          </div>
        </SubSection>

        <SubSection title="7.2 What Happens When Cookies Deleted">
          <ul className="space-y-1">
            <ListItem>You remain logged in (session survives)</ListItem>
            <ListItem>Your preferences reset to defaults</ListItem>
            <ListItem>Tracking data cleared</ListItem>
            <ListItem>Some convenience features may not work</ListItem>
            <ListItem>You'll see consent banner again on next visit</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="8. International Data Transfers">
        <SubSection title="8.1 Cookie Data Location">
          <ul className="space-y-1">
            <ListItem><strong>Analytics Data:</strong> Stored in Google (USA)</ListItem>
            <ListItem><strong>Mixpanel Data:</strong> Stored in USA</ListItem>
            <ListItem><strong>Marketing Data:</strong> Stored in USA</ListItem>
            <ListItem><strong>Personal Cookies:</strong> Stored on your device</ListItem>
          </ul>
        </SubSection>

        <SubSection title="8.2 Data Privacy">
          <ul className="space-y-1">
            <ListItem>Google Analytics anonymizes IP addresses</ListItem>
            <ListItem>Cookies generally don't contain personal data</ListItem>
            <ListItem>GDPR Standard Contractual Clauses in place</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="9. GDPR & CCPA Compliance">
        <SubSection title="9.1 GDPR (EU Users)">
          <ul className="space-y-1">
            <ListItem>Essential cookies don't require consent</ListItem>
            <ListItem>Consent required for analytics, marketing, tracking</ListItem>
            <ListItem>You have right to refuse non-essential cookies</ListItem>
            <ListItem>No consequences for refusing marketing cookies</ListItem>
          </ul>
        </SubSection>

        <SubSection title="9.2 CCPA (California Users)">
          <ul className="space-y-1">
            <ListItem>Similar rights to GDPR</ListItem>
            <ListItem>"Do Not Sell My Personal Information" respected</ListItem>
            <ListItem>Opt-out disables marketing cookies</ListItem>
          </ul>
        </SubSection>

        <SubSection title="9.3 Opt-Out Rights">
          <ul className="space-y-1">
            <ListItem>Opt-out via cookie preferences</ListItem>
            <ListItem>Opt-out via "Do Not Sell My Data" footer link</ListItem>
            <ListItem>Opt-out preference honored for 1 year</ListItem>
            <ListItem>You can renew opt-out anytime</ListItem>
          </ul>
        </SubSection>
      </Section>

      <Section title="10. Frequently Asked Questions">
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">Can I prevent cookies?</p>
            <p className="text-gray-700 text-sm mt-1">Yes, except essential cookies. You can refuse non-essential cookies without loss of service.</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">Are cookies safe?</p>
            <p className="text-gray-700 text-sm mt-1">Cookies themselves don't execute code or install malware. Never share cookies with untrusted parties.</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">Can I see what cookies are set?</p>
            <p className="text-gray-700 text-sm mt-1">Yes, in browser Developer Tools: Right-click &gt; Inspect &gt; Application &gt; Cookies</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">Will I be tracked after leaving your site?</p>
            <p className="text-gray-700 text-sm mt-1">Third-party cookies (Google Ads, Facebook) may track you on other websites. You can disable these in preferences.</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">How do I opt-out of Google Analytics?</p>
            <p className="text-gray-700 text-sm mt-1">Install <a href="https://tools.google.com/dlpage/gaoptout" className="text-indigo-600 hover:underline">Google Analytics Opt-Out Browser Add-on</a></p>
          </div>
        </div>
      </Section>

      <Section title="11. Contact Us">
        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <div>
            <p className="font-semibold text-gray-900">Cookie-Related Questions</p>
            <p className="text-gray-700">Email: <a href="mailto:privacy@xalora.com" className="text-indigo-600 hover:underline">privacy@xalora.com</a></p>
            <p className="text-gray-700">Response Time: Within 5 business days</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Privacy Settings</p>
            <p className="text-gray-700">Account &gt; Privacy &gt; Cookie Preferences</p>
          </div>
        </div>
      </Section>

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p><strong>Document Version:</strong> 1.0</p>
        <p><strong>Last Updated:</strong> January 2025</p>
        <p><strong>Next Review:</strong> January 2026</p>
      </div>
    </LegalLayout>
  );
};

export default CookiePolicy;
