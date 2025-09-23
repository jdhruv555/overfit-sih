import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainDashboard = () => {
  const navigate = useNavigate();

  const portalCards = [
    {
      id: 'cyber-incident',
      title: 'Cyber Incident Portal',
      description: 'Report cyber crimes that have already taken place. Upload evidence and get AI classification with priority scoring and next steps guidance.',
      icon: '🛡️',
      route: '/cyber-incident',
      color: 'from-red-600 to-red-800',
      hoverColor: 'hover:from-red-500 hover:to-red-700'
    },
    {
      id: 'safety-web',
      title: 'Safety Web Portal',
      description: 'Check if files or URLs are malicious. Our AI analyzes and classifies threats, providing safety recommendations and alerts.',
      icon: '🔍',
      route: '/safety-web',
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'hover:from-blue-500 hover:to-blue-700'
    },
    {
      id: 'cert-dashboard',
      title: 'CERT Dashboard',
      description: 'View all reported incidents with Reporter ID, Evidence Type, Classification Results, and Priority Scores. (Official Access)',
      icon: '📊',
      route: '/cert-dashboard',
      color: 'from-green-600 to-green-800',
      hoverColor: 'hover:from-green-500 hover:to-green-700'
    }
  ];

  const handleLogout = () => {
    // Clear any stored tokens and redirect to login
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">Cyber Security Portal</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Welcome to the Security Portal
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from the available security services below. Each portal is designed to help you 
            report incidents, check for threats, or monitor security status.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portalCards.map((portal) => (
            <div
              key={portal.id}
              className={`bg-gradient-to-br ${portal.color} ${portal.hoverColor} rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 cursor-pointer`}
              onClick={() => navigate(portal.route)}
            >
              <div className="p-8 text-white">
                <div className="text-6xl mb-6 text-center">{portal.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-center">{portal.title}</h3>
                <p className="text-gray-100 text-center leading-relaxed">
                  {portal.description}
                </p>
                <div className="mt-6 text-center">
                  <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                    Click to Access
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📝</div>
              <h4 className="text-lg font-semibold text-white mb-2">Report & Upload</h4>
              <p className="text-gray-300">Provide detailed information and upload evidence files for analysis.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-gray-300">Our AI classifies threats and assigns priority scores automatically.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-lg font-semibold text-white mb-2">Instant Response</h4>
              <p className="text-gray-300">Get immediate feedback and next steps for your security concerns.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
