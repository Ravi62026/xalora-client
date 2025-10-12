import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components';
import { 
  LayoutDashboard, 
  Code, 
  Trophy, 
  Briefcase
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import OverviewAnalytics from '../components/Dashboard/OverviewAnalytics';
import DSAAnalytics from '../components/Dashboard/DSAAnalytics';
import QuizAnalytics from '../components/Dashboard/QuizAnalytics';
import InternshipAnalytics from '../components/Dashboard/InternshipAnalytics';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarWidth, setSidebarWidth] = useState(256); // 64 in pixels
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA Problems', icon: Code },
    { id: 'quiz', label: 'Quiz Analytics', icon: Trophy },
    { id: 'internships', label: 'Internships', icon: Briefcase },
  ];

  // Handle sidebar resizing
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
  }, []);

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
      default:
        return <OverviewAnalytics />;
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Left Sidebar */}
        <div 
          ref={sidebarRef}
          className="bg-gradient-to-b from-gray-900 via-slate-900 to-black border-r border-gray-700 fixed h-full overflow-y-auto flex flex-col"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Analytics</h2>
            <p className="text-sm text-gray-400">Track your progress</p>
          </div>
          
          <nav className="px-3 pb-6 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="px-6 py-4 border-t border-gray-700">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Streak</span>
                <span className="text-sm font-bold text-orange-400">🔥 7 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Rank</span>
                <span className="text-sm font-bold text-purple-400">#245</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Points</span>
                <span className="text-sm font-bold text-green-400">1,250</span>
              </div>
            </div>
          </div>
          
          {/* Resize handle */}
          <div 
            className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-gray-700 hover:bg-purple-500 transition-colors"
            onMouseDown={startResizing}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-slate-900 to-black" style={{ marginLeft: `${sidebarWidth}px` }}>
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