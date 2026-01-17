import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components';
import {
  LayoutDashboard,
  Code,
  Trophy,
  Briefcase,
  Video,
  Menu,
  X
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import OverviewAnalytics from '../components/Dashboard/OverviewAnalytics';
import DSAAnalytics from '../components/Dashboard/DSAAnalytics';
import QuizAnalytics from '../components/Dashboard/QuizAnalytics';
import InternshipAnalytics from '../components/Dashboard/InternshipAnalytics';
import MyInterviews from './AIInterview/MyInterviews';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarWidth, setSidebarWidth] = useState(256); // 256px default
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Problems', icon: Code },
    { id: 'quiz', label: 'Quiz Analytics', icon: Trophy },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'ai-interviews', label: 'AI Interviews', icon: Video },
  ];

  // Handle sidebar resizing (desktop only)
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < 500) { // Min 200px, max 500px
        setSidebarWidth(newWidth);
      }
    }
  };

  // Add event listeners for resizing
  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  // Close mobile menu when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewAnalytics />;
      case 'dsa':
        return <DSAAnalytics />;
      case 'quiz':
        return <QuizAnalytics />;
      case 'internships':
        return <InternshipAnalytics />;
      case 'ai-interviews':
        return <MyInterviews />;
      default:
        return <OverviewAnalytics />;
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 p-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-300"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Mobile Drawer & Desktop Fixed */}
        <div
          ref={sidebarRef}
          className={`
            bg-gradient-to-b from-gray-900 via-slate-900 to-black border-r border-gray-700
            fixed lg:sticky top-0 h-screen overflow-y-auto flex flex-col z-40
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ width: window.innerWidth >= 1024 ? `${sidebarWidth}px` : '280px' }}
        >
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Analytics</h2>
            <p className="text-xs sm:text-sm text-gray-400">Track your progress</p>
          </div>

          <nav className="px-3 py-4 sm:py-6 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg mb-2 transition-all text-sm sm:text-base ${isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 sm:mb-3">Quick Stats</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-300">Streak</span>
                <span className="text-xs sm:text-sm font-bold text-orange-400">🔥 7 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-300">Rank</span>
                <span className="text-xs sm:text-sm font-bold text-purple-400">#245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-300">Points</span>
                <span className="text-xs sm:text-sm font-bold text-green-400">1,250</span>
              </div>
            </div>
          </div>

          {/* Resize handle - Desktop only */}
          <div
            className="hidden lg:block absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-700 hover:bg-purple-500 transition-colors"
            onMouseDown={startResizing}
          />
        </div>

        {/* Main Content */}
        <div
          className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-x-hidden"
          style={{ marginLeft: window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0' }}
        >
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
