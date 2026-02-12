import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();
  const [showCookieManager, setShowCookieManager] = useState(false);

  const handleManageCookiePreferences = () => {
    // Clear the cookie consent so banner reappears
    localStorage.removeItem('cookie_consent');
    // Navigate to cookies page
    navigate('/cookies');
  };

  // Legal navigation handlers
  const handleNavigateLegal = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Xalora</h3>
            <p className="text-gray-400 text-sm">
              Master coding interviews with AI-powered practice and real-time feedback.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a href="https://twitter.com/xalora" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com/xalora" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/company/xalora" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/problems" className="text-gray-400 hover:text-white transition-colors">Problems</a></li>
              <li><a href="/quizzes" className="text-gray-400 hover:text-white transition-colors">Quizzes</a></li>
              <li><a href="/interviews" className="text-gray-400 hover:text-white transition-colors">Interviews</a></li>
              <li><a href="/internships" className="text-gray-400 hover:text-white transition-colors">Internships</a></li>
              <li><a href="/resume-ai" className="text-gray-400 hover:text-white transition-colors">Resume AI</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="/status" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => handleNavigateLegal('/privacy')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => handleNavigateLegal('/terms')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Service</button></li>
              <li><button onClick={() => handleNavigateLegal('/cookies')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Cookie Policy</button></li>
              <li><button onClick={() => handleNavigateLegal('/acceptable-use')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Acceptable Use</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:support@xalora.com" className="text-gray-400 hover:text-white transition-colors">
                  support@xalora.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:legal@xalora.com" className="text-gray-400 hover:text-white transition-colors">
                  legal@xalora.com
                </a>
              </li>
              <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          {/* Cookie Settings & Do Not Sell */}
          <div className="text-center mb-6">
            <button
              onClick={handleManageCookiePreferences}
              className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Manage Cookie Preferences
            </button>
            <span className="text-gray-600 mx-2">•</span>
            <button
              onClick={() => handleNavigateLegal('/privacy')}
              className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Do Not Sell My Personal Information
            </button>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2025 Xalora Inc. All rights reserved.</p>
            <div className="flex gap-4 text-gray-400 text-sm mt-4 md:mt-0">
              <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
              <span>•</span>
              <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>

        {/* Compliance Note */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
          <p>
            Xalora is committed to legal compliance and user privacy. We comply with GDPR, CCPA, and other privacy regulations.
            Read our <a href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</a> for details on how we handle your data.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/**
 * INTEGRATION INSTRUCTIONS:
 * ==========================
 *
 * 1. Replace your existing Footer component with this one, OR
 * 2. Update your existing Footer to include the legal links section
 *
 * 2. Update email addresses:
 *    - Replace support@xalora.com with your actual support email
 *    - Replace legal@xalora.com with your actual legal email
 *
 * 3. Update social media links:
 *    - Replace /xalora with your actual social handles
 *
 * 4. Add this Footer to your main layout (App.jsx or _layout.jsx):
 *
 *    import Footer from './components/Footer';
 *
 *    function App() {
 *      return (
 *        <>
 *          <Header />
 *          <main>{children}</main>
 *          <Footer />
 *        </>
 *      );
 *    }
 *
 * 5. Test footer links work correctly on all pages
 */
