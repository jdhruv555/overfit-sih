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
      description: 'For CERT-Army officals, View all reported incidents with Reporter ID, Evidence Type, Classification Results, and Priority Scores.  (currently accessible to all for the demo)',
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#6c5ce7]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#00d2ff]/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#00d2ff] shadow-glass overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-white/40 via-transparent to-white/40 animate-shimmer bg-[length:200%_100%]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm uppercase tracking-widest text-white/60">Team OverFit</span>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">Cyber Security Portal</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-white/80">
              <button onClick={() => navigate('/dashboard')} className="hover:text-white transition">Home</button>
              <button onClick={() => navigate('/cyber-incident')} className="hover:text-white transition">Incidents</button>
              <button onClick={() => navigate('/safety-web')} className="hover:text-white transition">Safety Web</button>
              <button onClick={() => navigate('/cert-dashboard')} className="hover:text-white transition">CERT</button>
            </div>

            <button
              onClick={handleLogout}
              className="group inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
            >
              <span className="h-2 w-2 rounded-full bg-rose-400 group-hover:bg-rose-300" /> Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">See Beyond the Surface</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Choose a portal to report incidents, analyze threats, or monitor intelligence.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portalCards.map((portal) => (
            <div
              key={portal.id}
              className={`group relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10`}
              onClick={() => navigate(portal.route)}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(800px circle at 0% 0%, rgba(108,92,231,0.12), transparent 40%), radial-gradient(800px circle at 100% 100%, rgba(0,210,255,0.12), transparent 40%)' }} />
              <div className="relative p-8 text-white">
                <div className="text-6xl mb-6 text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-floaty">{portal.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-center tracking-tight">{portal.title}</h3>
                <p className="text-white/80 text-center leading-relaxed">
                  {portal.description}
                </p>
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 transition group-hover:border-white/20 group-hover:bg-white/10">
                    Click to Access
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L14 6.414V17a1 1 0 11-2 0V6.414L7.707 8.707A1 1 0 116.293 7.293l4-4z"/></svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works - glassmorphism */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-glass relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[#6c5ce7]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-[#00d2ff]/20 blur-3xl" />
          <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition animate-fadeInUp" style={{ animationDelay: '0ms' }}>
              <div className="text-4xl mb-3 animate-floaty">📝</div>
              <h4 className="text-lg font-semibold text-white mb-2">Report & Upload</h4>
              <p className="text-white/70">Provide detailed information and upload evidence files for analysis.</p>
            </div>
            <div className="text-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition animate-fadeInUp" style={{ animationDelay: '120ms' }}>
              <div className="text-4xl mb-3 animate-floaty">🤖</div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-white/70">Our AI classifies threats and assigns priority scores automatically.</p>
            </div>
            <div className="text-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:bg-white/10 transition animate-fadeInUp" style={{ animationDelay: '240ms' }}>
              <div className="text-4xl mb-3 animate-floaty">⚡</div>
              <h4 className="text-lg font-semibold text-white mb-2">Instant Response</h4>
              <p className="text-white/70">Get immediate feedback and next steps for your security concerns.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
