import React, { useState } from 'react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // NOTE: In a Docker setup, the browser needs to call the backend service name.
      // But for local development before everything is dockerized, we use localhost.
      // The '/api/v1' prefix is based on your backend router setup.
      const response = await fetch('/api/v1/users/', {
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

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors or other issues
        throw new Error(data.detail || 'Failed to register.');
      }

      setMessage('Registration successful! Please log in.');
      // Clear form
      setEmail('');
      setPassword('');
      setFullName('');
      setTimeout(() => onSwitch(), 2000); // Switch to login form after 2 seconds

    } catch (error) {
      setMessage(error.message);
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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input id="fullName" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
        <Input id="email" label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <Button disabled={loading}>{loading ? 'Registering...' : 'Create Account'}</Button>
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
      const response = await fetch('/api/v1/login/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to log in.');
      }
      
      // In a real app, you'd save this token (e.g., in localStorage)
      console.log('Access Token:', data.access_token);
      setMessage(`Login successful! Token received.`);

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


// The main App component that switches between Login and Register
export default function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans">
      {isLogin ? <LoginForm onSwitch={toggleForm} /> : <RegisterForm onSwitch={toggleForm} />}
    </div>
  );
}
