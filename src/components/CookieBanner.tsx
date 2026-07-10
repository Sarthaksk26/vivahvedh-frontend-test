import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Small delay to ensure smooth rendering after page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Note: declining will still set the local storage flag to stop prompting,
    // but in a real-world scenario you would disable analytics/tracking here.
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 transform transition-transform duration-500 translate-y-0">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-bottom-10">
        <div className="flex-1 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 text-base mb-1">We value your privacy</p>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleDecline}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
