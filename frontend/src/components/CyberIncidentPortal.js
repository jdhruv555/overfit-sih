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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-white mr-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-white">🛡️ Cyber Incident Portal</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Report a Cyber Incident</h2>
            <p className="text-gray-300">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                />
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="evidence" className="block text-sm font-medium text-gray-300 mb-2">
                  Evidence Upload (≤10 MB)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-gray-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label htmlFor="evidence" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-red-400 hover:text-red-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
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
                    <p className="text-xs text-gray-500">PDF, DOC, images, or archives up to 10MB</p>
                  </div>
                </div>
                {formData.evidence && (
                  <p className="mt-2 text-sm text-green-400">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || !formData.description}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  {loading ? 'Analyzing Incident...' : 'Submit Incident Report'}
                </button>
              </div>
            </form>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className="bg-green-900 border border-green-700 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">✅ Incident Analysis Complete</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-300 font-medium">Classification: </span>
                    <span className="text-white font-bold">{result.classification}</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">Priority Score: </span>
                    <span className="text-yellow-400 font-bold text-xl">{result.priorityScore}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-300 font-medium">CERT Alert: </span>
                    <span className="text-green-400 font-bold">{result.alertSent ? 'Sent' : 'Not Sent'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">📋 Recommended Next Steps</h3>
                <ul className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-3">{index + 1}.</span>
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
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Report Another Incident
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-lg ${message.includes('successful') ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CyberIncidentPortal;
