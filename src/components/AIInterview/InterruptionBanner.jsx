import { useEffect, useState } from 'react';
import { AlertCircle, ShieldAlert, XCircle } from 'lucide-react';

const SEVERITY = {
  info: {
    gradient: "from-blue-500 to-indigo-500",
    icon: AlertCircle,
  },
  warning: {
    gradient: "from-orange-500 to-red-500",
    icon: ShieldAlert,
  },
  critical: {
    gradient: "from-red-600 to-red-800",
    icon: XCircle,
  },
};

const InterruptionBanner = ({ message, severity = "warning", duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!isVisible || !message) return null;

  const config = SEVERITY[severity] || SEVERITY.warning;
  const Icon = config.icon;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
      <div className={`bg-gradient-to-r ${config.gradient} text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
        <Icon className="w-6 h-6 animate-pulse" />
        <p className="font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
};

export default InterruptionBanner;
