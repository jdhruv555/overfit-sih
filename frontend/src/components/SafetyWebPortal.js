import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SafetyWebPortal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    url: '',
    file: null,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      setMessage('File size must be less than 10MB');
      return;
    }
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!formData.url && !formData.file) {
      setMessage('Please provide either a URL or upload a file to analyze.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result for demo
      const mockResult = {
        isMalicious: Math.random() > 0.5, // Random for demo
        threatLevel: Math.random() > 0.5 ? 'High' : 'Low',
        confidence: (Math.random() * 0.4 + 0.6).toFixed(2), // 60-100%
        details: {
          type: formData.url ? 'URL Analysis' : 'File Analysis',
          target: formData.url || formData.file?.name,
          detectedThreats: Math.random() > 0.5 ? ['Malware', 'Phishing'] : ['Clean'],
          riskScore: Math.floor(Math.random() * 10) + 1
        },
        nextSteps: Math.random() > 0.5 ? [
          'Do not click on this link or download this file',
          'Delete the file immediately if already downloaded',
          'Run a full antivirus scan on your system',
          'Change passwords if you interacted with this content',
          'Report to your IT security team'
        ] : [
          'This appears to be safe content',
          'You can proceed with normal usage',
          'Continue to monitor for any suspicious behavior'
        ]
      };
      
      setResult(mockResult);
      setMessage('Analysis complete!');
    } catch (error) {
      setMessage('Error analyzing content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#6c5ce7]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#00d2ff]/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
              >
                <span aria-hidden>←</span> Back
              </button>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">🔍 Safety Web Portal</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Check for Malicious Content</h2>
            <p className="text-white/70">
              Upload files or enter URLs to check if they contain malicious content. 
              Our AI will analyze and provide safety recommendations.
            </p>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                  URL to Check
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/suspicious-link"
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-white/20"
                />
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/5 text-white/60 rounded">OR</span>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">
                  Upload File to Check (≤10 MB)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 rounded-lg border border-dashed border-white/15 hover:border-white/25 bg-white/5 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-white/70">
                      <label htmlFor="file" className="relative cursor-pointer rounded-md font-medium text-sky-300 hover:text-sky-200">
                        <span>Upload a file</span>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="*/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-white/50">Any file type up to 10MB</p>
                  </div>
                </div>
                {formData.file && (
                  <p className="mt-2 text-sm text-emerald-300">
                    Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Additional Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide any additional context about where you received this content or why you're concerned..."
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-white/20"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || (!formData.url && !formData.file)}
                  className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-600 disabled:from-sky-400 disabled:to-sky-400 text-white font-bold py-4 px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                >
                  {loading ? 'Analyzing Content...' : 'Check for Threats'}
                </button>
              </div>
            </form>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className={`rounded-lg p-6 border ${result.isMalicious ? 'border-rose-400/20 bg-rose-400/10' : 'border-emerald-400/20 bg-emerald-400/10'}`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">
                    {result.isMalicious ? '🚨' : '✅'}
                  </span>
                  <div>
                    <h3 className={`text-2xl font-bold ${result.isMalicious ? 'text-rose-300' : 'text-emerald-300'}`}>
                      {result.isMalicious ? 'THREAT DETECTED' : 'SAFE CONTENT'}
                    </h3>
                    <p className="text-gray-300">
                      {result.details.type} - Confidence: {(result.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300 font-medium">Target: </span>
                    <span className="text-white">{result.details.target}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">Threat Level: </span>
                    <span className={`font-bold ${result.threatLevel === 'High' ? 'text-rose-300' : 'text-yellow-300'}`}>
                      {result.threatLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">Risk Score: </span>
                    <span className="text-white font-bold">{result.details.riskScore}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">Detected Threats: </span>
                    <span className="text-white">
                      {result.details.detectedThreats.length > 0 ? result.details.detectedThreats.join(', ') : 'None'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-6 border border-sky-400/20 bg-sky-400/10">
                <h3 className="text-xl font-bold text-sky-300 mb-4">📋 Recommended Actions</h3>
                <ul className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-sky-300 mr-3">{index + 1}.</span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.isMalicious && (
                <div className="rounded-lg p-6 border border-amber-400/20 bg-amber-400/10">
                  <h3 className="text-xl font-bold text-amber-300 mb-2">⚠️ CERT Alert</h3>
                  <p className="text-gray-300">
                    A high-priority alert has been sent to the CERT dashboard due to the malicious nature of this content.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      url: '',
                      file: null,
                      description: ''
                    });
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Check Another Item
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-600 text-white font-bold py-3 px-6 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${message.includes('complete') ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border border-rose-400/20 bg-rose-400/10 text-rose-300'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SafetyWebPortal;
