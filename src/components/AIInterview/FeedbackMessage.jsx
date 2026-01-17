import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

const FeedbackMessage = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const getIcon = () => {
    switch(type) {
      case 'excellent': return <CheckCircle className="w-6 h-6" />;
      case 'good': return <Info className="w-6 h-6" />;
      case 'fair': return <AlertCircle className="w-6 h-6" />;
      case 'poor': return <XCircle className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  const getColors = () => {
    switch(type) {
      case 'excellent': return 'from-green-500 to-emerald-500';
      case 'good': return 'from-blue-500 to-cyan-500';
      case 'fair': return 'from-yellow-500 to-orange-500';
      case 'poor': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-slideInRight">
      <div className={`bg-gradient-to-r ${getColors()} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md`}>
        {getIcon()}
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default FeedbackMessage;
