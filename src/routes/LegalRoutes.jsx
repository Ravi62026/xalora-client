// client/src/routes/Routes.jsx
// THIS FILE SHOWS HOW TO ADD LEGAL PAGES TO YOUR ROUTER

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import legal page components
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy';
import TermsOfService from '../pages/Legal/TermsOfService';
import CookiePolicy from '../pages/Legal/CookiePolicy';
import AcceptableUsePolicy from '../pages/Legal/AcceptableUsePolicy';

// Import other pages
import HomePage from '../pages/Home';
import ProblemsPage from '../pages/Problems';
import ProfilePage from '../pages/Profile';

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Home & Main Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Legal Routes - ADD THESE! */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/acceptable-use" element={<AcceptableUsePolicy />} />

        {/* Alternative routes (optional - for SEO) */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* Catch-all 404 (keep at end) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

/**
 * IMPLEMENTATION INSTRUCTIONS:
 * ============================
 *
 * 1. Update your main App.jsx or index.jsx to use AppRoutes:
 *
 *    import AppRoutes from './routes/Routes';
 *
 *    function App() {
 *      return (
 *        <>
 *          <CookieConsentBanner />
 *          <AppRoutes />
 *        </>
 *      );
 *    }
 *
 * 2. Add the CookieConsentBanner to your main App component (or layout)
 *
 * 3. Update your Footer component to include legal links (see Footer.jsx example)
 *
 * 4. Test all routes:
 *    - http://localhost:5173/privacy
 *    - http://localhost:5173/terms
 *    - http://localhost:5173/cookies
 *    - http://localhost:5173/acceptable-use
 *
 * 5. Update email addresses in components before launching:
 *    - Replace legal@xalora.com
 *    - Replace privacy@xalora.com
 *    - Replace support@xalora.com
 *    - Replace abuse@xalora.com
 */
