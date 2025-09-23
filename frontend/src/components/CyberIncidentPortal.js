import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CyberIncidentPortal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    url: '',
    evidence: null,
    additionalInfo: ''
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
      evidence: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result for demo
      const mockResult = {
        classification: 'High Priority Cyber Attack',
        priorityScore: 8.5,
        nextSteps: [
          'Immediately disconnect affected systems from the network',
          'Preserve all evidence and logs',
          'Contact your IT security team',
          'File a police report if financial loss occurred',
          'Monitor for additional suspicious activity'
        ],
        alertSent: true
      };
      
      setResult(mockResult);
      setMessage('Incident reported successfully! CERT has been alerted.');
    } catch (error) {
      setMessage('Error submitting incident report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0f0f17] to-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#6c5ce7]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#ff7675]/10 blur-3xl" />
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
                <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">🛡️ Cyber Incident Portal</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Report a Cyber Incident</h2>
            <p className="text-white/70">
              Provide detailed information about the cyber crime that has occurred. 
              Our AI will analyze the evidence and provide priority scoring and next steps.
            </p>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Incident Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Incident Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the cyber incident in detail. Include what happened, when it occurred, and any suspicious activities you noticed..."
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-white/20"
                />
              </div>

              {/* URL Field */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                  Related URL (if applicable)
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/suspicious-link"
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-white/20"
                />
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="evidence" className="block text-sm font-medium text-gray-300 mb-2">
                  Evidence Upload (≤10 MB)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 rounded-lg border border-dashed border-white/15 hover:border-white/25 bg-white/5 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-white/70">
                      <label htmlFor="evidence" className="relative cursor-pointer rounded-md font-medium text-rose-300 hover:text-rose-200">
                        <span>Upload a file</span>
                        <input
                          id="evidence"
                          name="evidence"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-white/50">PDF, DOC, images, or archives up to 10MB</p>
                  </div>
                </div>
                {formData.evidence && (
                  <p className="mt-2 text-sm text-emerald-400">
                    Selected: {formData.evidence.name} ({(formData.evidence.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={4}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any additional context, timeline, or relevant information..."
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-white/20"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !formData.description}
                  className="w-full rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-600 disabled:from-rose-400 disabled:to-rose-400 text-white font-bold py-4 px-6 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400/50"
                >
                  {loading ? 'Analyzing Incident...' : 'Submit Incident Report'}
                </button>
              </div>
            </form>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className="rounded-lg p-6 border border-emerald-400/20 bg-emerald-400/10">
                <h3 className="text-2xl font-bold text-emerald-300 mb-4">✅ Incident Analysis Complete</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-300 font-medium">Classification: </span>
                    <span className="text-white font-bold">{result.classification}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">Priority Score: </span>
                    <span className="text-yellow-300 font-bold text-xl">{result.priorityScore}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">CERT Alert: </span>
                    <span className="text-emerald-300 font-bold">{result.alertSent ? 'Sent' : 'Not Sent'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-6 border border-sky-400/20 bg-sky-400/10">
                <h3 className="text-xl font-bold text-sky-300 mb-4">📋 Recommended Next Steps</h3>
                <ul className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-sky-300 mr-3">{index + 1}.</span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setFormData({
                      description: '',
                      url: '',
                      evidence: null,
                      additionalInfo: ''
                    });
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Report Another Incident
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-600 text-white font-bold py-3 px-6 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${message.includes('successful') ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border border-rose-400/20 bg-rose-400/10 text-rose-300'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CyberIncidentPortal;
