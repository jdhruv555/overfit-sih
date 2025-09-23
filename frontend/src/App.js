import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './components/MainDashboard';
import CyberIncidentPortal from './components/CyberIncidentPortal';
import SafetyWebPortal from './components/SafetyWebPortal';
import CertDashboard from './components/CertDashboard';
// Prefer same-origin API calls so it works behind nginx (http://localhost)
// Allow override for pure local dev with backend on another origin
const API_BASE = process.env.REACT_APP_API_BASE || '';

// Helper to convert FastAPI error payloads into readable text
const formatDetail = (detail) => {
  if (!detail) return 'Request failed';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        if (typeof d === 'string') return d;
        const location = Array.isArray(d.loc) ? d.loc.join('.') : d.loc;
        const message = d.msg || d.message || JSON.stringify(d);
        return location ? `${location}: ${message}` : message;
      })
      .join('\n');
  }
  if (typeof detail === 'object') {
    if (detail.msg) return detail.msg;
    return JSON.stringify(detail);
  }
  return String(detail);
};

// Basic email format validation (user@example.com)
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// A single reusable input component
const Input = ({ id, label, type = 'text', value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <div className="mt-1">
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  </div>
);

// A reusable button component
const Button = ({ type = 'submit', children, onClick, disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
      disabled ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500`}
  >
    {children}
  </button>
);

// The main Registration Form Component
const RegisterForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email like user@example.com');
      }
      if (password.length < 4) {
        throw new Error('Password should be at least 4 characters');
      }
      // NOTE: In a Docker setup, the browser needs to call the backend service name.
      // But for local development before everything is dockerized, we use localhost.
      // The '/api/v1' prefix is based on your backend router setup.
      const response = await fetch(`${API_BASE}/api/v1/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: fullName,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : { raw: await response.text() };

      if (!response.ok) {
        throw new Error(formatDetail(data.detail) || 'Failed to register.');
      }

  
      setMessage('Registration created. Enter the OTP sent to your email (demo).');
      setRegisteredEmail(data.email || email);
      if (data.otp) {
        // show the OTP to the user in demo mode
        setMessage((prev) => `${prev} Demo OTP: ${data.otp}`);
      }
      setShowOtp(true);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/v1/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : { raw: await response.text() };
      if (!response.ok) throw new Error(formatDetail(data.detail) || 'OTP verification failed');

      setMessage('Verification successful! You can now log in.');
      setEmail('');
      setPassword('');
      setFullName('');
      setOtp('');
      setShowOtp(false);
      setTimeout(() => onSwitch(), 1500);
    } catch (err) {
      setMessage(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <div>
        <h2 className="text-3xl font-extrabold text-center text-white">Create your account</h2>
        <p className="mt-2 text-sm text-center text-gray-400">
          Or{' '}
          <button onClick={onSwitch} className="font-medium text-indigo-400 hover:text-indigo-300">
            sign in to your existing account
          </button>
        </p>
      </div>
      <form className="space-y-6" onSubmit={showOtp ? handleVerifyOtp : handleSubmit}>
        <Input id="fullName" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
        <Input id="email" label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        {showOtp ? (
          <Input id="otp" label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
        ) : null}
        <Button disabled={loading}>{loading ? (showOtp ? 'Verifying...' : 'Registering...') : (showOtp ? 'Verify OTP' : 'Create Account')}</Button>
      </form>
      {message && <p className={`mt-4 text-sm text-center ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
    </div>
  );
};

// The main Login Form Component
const LoginForm = ({ onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // FastAPI's token endpoint expects form data, not JSON
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      if (!isValidEmail(username)) {
        throw new Error('Please enter a valid email like user@example.com');
      }
      if (password.length < 4) {
        throw new Error('Password should be at least 4 characters');
      }
      const response = await fetch(`${API_BASE}/api/v1/login/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : { raw: await response.text() };

      if (!response.ok) {
        throw new Error(formatDetail(data.detail) || 'Failed to log in.');
      }
      
      // Save token and redirect to dashboard
      localStorage.setItem('access_token', data.access_token);
      setMessage(`Login successful! Redirecting to dashboard...`);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <div>
        <h2 className="text-3xl font-extrabold text-center text-white">Sign in to your account</h2>
        <p className="mt-2 text-sm text-center text-gray-400">
          Or{' '}
          <button onClick={onSwitch} className="font-medium text-indigo-400 hover:text-indigo-300">
            create a new account
          </button>
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input id="username" label="Email address" type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="you@example.com" />
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <Button disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</Button>
      </form>
      {message && <p className={`mt-4 text-sm text-center ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
    </div>
  );
};


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/" replace />;
};

// The main App component with routing
export default function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Router>
      <Routes>
        {/* Login/Register Route */}
        <Route 
          path="/" 
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans">
              {isLogin ? <LoginForm onSwitch={toggleForm} /> : <RegisterForm onSwitch={toggleForm} />}
            </div>
          } 
        />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cyber-incident" 
          element={
            <ProtectedRoute>
              <CyberIncidentPortal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/safety-web" 
          element={
            <ProtectedRoute>
              <SafetyWebPortal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cert-dashboard" 
          element={
            <ProtectedRoute>
              <CertDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
