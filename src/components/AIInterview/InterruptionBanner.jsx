import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

const InterruptionBanner = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
        <AlertCircle className="w-6 h-6 animate-pulse" />
        <p className="font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
};

export default InterruptionBanner;
