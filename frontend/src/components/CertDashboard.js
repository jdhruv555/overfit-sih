import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CertDashboard = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Mock data for demo - replace with actual API calls
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockIncidents = [
        {
          id: 'INC-001',
          reporterId: 'user123@example.com',
          evidenceType: 'File Upload',
          classificationResult: 'High Priority Cyber Attack',
          priorityScore: 9.2,
          timestamp: '2024-01-15T10:30:00Z',
          status: 'Active',
          source: 'Cyber Incident Portal'
        },
        {
          id: 'INC-002',
          reporterId: 'user456@example.com',
          evidenceType: 'URL Analysis',
          classificationResult: 'Malicious Website',
          priorityScore: 7.8,
          timestamp: '2024-01-15T09:15:00Z',
          status: 'Under Investigation',
          source: 'Safety Web Portal'
        },
        {
          id: 'INC-003',
          reporterId: 'user789@example.com',
          evidenceType: 'File Upload',
          classificationResult: 'Phishing Attempt',
          priorityScore: 6.5,
          timestamp: '2024-01-15T08:45:00Z',
          status: 'Resolved',
          source: 'Cyber Incident Portal'
        },
        {
          id: 'INC-004',
          reporterId: 'user321@example.com',
          evidenceType: 'URL Analysis',
          classificationResult: 'Suspicious Content',
          priorityScore: 4.2,
          timestamp: '2024-01-15T07:20:00Z',
          status: 'Active',
          source: 'Safety Web Portal'
        },
        {
          id: 'INC-005',
          reporterId: 'user654@example.com',
          evidenceType: 'File Upload',
          classificationResult: 'Malware Detected',
          priorityScore: 8.9,
          timestamp: '2024-01-15T06:10:00Z',
          status: 'Under Investigation',
          source: 'Cyber Incident Portal'
        }
      ];
      
      setIncidents(mockIncidents);
      setLoading(false);
    };

    fetchIncidents();
  }, []);

  const getPriorityColor = (score) => {
    if (score >= 8) return 'text-red-400 bg-red-900';
    if (score >= 6) return 'text-yellow-400 bg-yellow-900';
    return 'text-green-400 bg-green-900';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-red-400 bg-red-900';
      case 'Under Investigation': return 'text-yellow-400 bg-yellow-900';
      case 'Resolved': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    if (filter === 'high-priority') return incident.priorityScore >= 8;
    if (filter === 'active') return incident.status === 'Active';
    if (filter === 'investigation') return incident.status === 'Under Investigation';
    return true;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
    if (sortBy === 'timestamp') return new Date(b.timestamp) - new Date(a.timestamp);
    return 0;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
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
              <h1 className="text-3xl font-bold text-white">📊 CERT Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">
              Official Access Only
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl text-red-400 mr-4">🚨</div>
              <div>
                <p className="text-gray-400 text-sm">Total Incidents</p>
                <p className="text-2xl font-bold text-white">{incidents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl text-yellow-400 mr-4">⚠️</div>
              <div>
                <p className="text-gray-400 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-white">
                  {incidents.filter(i => i.priorityScore >= 8).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl text-blue-400 mr-4">🔍</div>
              <div>
                <p className="text-gray-400 text-sm">Under Investigation</p>
                <p className="text-2xl font-bold text-white">
                  {incidents.filter(i => i.status === 'Under Investigation').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-3xl text-green-400 mr-4">✅</div>
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-white">
                  {incidents.filter(i => i.status === 'Resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-300 font-medium">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Incidents</option>
                <option value="high-priority">High Priority (≥8)</option>
                <option value="active">Active</option>
                <option value="investigation">Under Investigation</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-gray-300 font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="priority">Priority Score</option>
                <option value="timestamp">Timestamp</option>
              </select>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Incident Reports</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-400">Loading incidents...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Incident ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Reporter ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Evidence Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Classification Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {sortedIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {incident.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {incident.reporterId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {incident.evidenceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {incident.classificationResult}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(incident.priorityScore)}`}>
                          {incident.priorityScore}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {incident.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTimestamp(incident.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {sortedIncidents.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No incidents found matching the current filter.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Export to CSV
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Generate Report
          </button>
        </div>
      </main>
    </div>
  );
};

export default CertDashboard;
