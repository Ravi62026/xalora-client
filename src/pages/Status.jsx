import React, { useState, useEffect } from "react";
import { Layout } from "../components";

const Status = () => {
  const [uptimeData, setUptimeData] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    currentUsers: 0,
    apiRequests: 0,
    codeExecutions: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);

  // Realistic status data with actual metrics
  const services = [
    {
      id: 1,
      name: "Website & Dashboard",
      status: "operational",
      description: "Core platform functionality",
      uptime: "99.98%",
      responseTime: "124ms",
      load: "23%",
      lastIncident: "2023-10-05",
      region: "Asia Pacific",
      version: "v2.4.1"
    },
    {
      id: 2,
      name: "API Services",
      status: "operational",
      description: "REST API endpoints",
      uptime: "99.95%",
      responseTime: "89ms",
      load: "67%",
      lastIncident: "2023-09-28",
      region: "Global",
      version: "v1.8.3"
    },
    {
      id: 3,
      name: "Code Execution Engine",
      status: "degraded",
      description: "Code compilation and execution",
      uptime: "99.92%",
      responseTime: "456ms",
      load: "89%",
      lastIncident: "2023-10-06",
      region: "US East",
      version: "v3.2.0"
    },
    {
      id: 4,
      name: "Database",
      status: "operational",
      description: "Primary data storage",
      uptime: "99.99%",
      responseTime: "23ms",
      load: "45%",
      lastIncident: "2023-09-15",
      region: "Global",
      version: "v5.7.21"
    },
    {
      id: 5,
      name: "Authentication",
      status: "operational",
      description: "User login and session management",
      uptime: "99.97%",
      responseTime: "156ms",
      load: "34%",
      lastIncident: "2023-08-22",
      region: "Europe",
      version: "v1.5.2"
    },
    {
      id: 6,
      name: "File Storage",
      status: "operational",
      description: "User file uploads and storage",
      uptime: "99.94%",
      responseTime: "234ms",
      load: "56%",
      lastIncident: "2023-09-30",
      region: "Asia Pacific",
      version: "v2.1.0"
    },
    {
      id: 7,
      name: "AI/ML Services",
      status: "operational",
      description: "Machine learning model inference",
      uptime: "99.89%",
      responseTime: "678ms",
      load: "78%",
      lastIncident: "2023-10-01",
      region: "US West",
      version: "v1.2.4"
    },
    {
      id: 8,
      name: "Notification Service",
      status: "operational",
      description: "Email and push notifications",
      uptime: "99.96%",
      responseTime: "92ms",
      load: "12%",
      lastIncident: "2023-07-18",
      region: "Global",
      version: "v3.0.1"
    }
  ];

  const incidents = [
    {
      id: 1,
      title: "Code Execution Engine Performance Degradation",
      status: "monitoring",
      description: "Increased latency in code execution due to high load. Engineers are implementing auto-scaling measures.",
      date: "Oct 6, 2023",
      duration: "Ongoing",
      affectedServices: ["Code Execution Engine"],
      impact: "High"
    },
    {
      id: 2,
      title: "Scheduled Maintenance",
      status: "resolved",
      description: "Planned maintenance for database optimization and index rebuilding",
      date: "Oct 2, 2023",
      duration: "2 hours",
      affectedServices: ["Database", "API Services"],
      impact: "Low"
    },
    {
      id: 3,
      title: "API Response Delays",
      status: "resolved",
      description: "Intermittent delays in API responses due to traffic spike during peak hours",
      date: "Sep 28, 2023",
      duration: "45 minutes",
      affectedServices: ["API Services", "Website & Dashboard"],
      impact: "Medium"
    },
    {
      id: 4,
      title: "Authentication Service Outage",
      status: "resolved",
      description: "Partial outage affecting login for European users due to regional load balancer issue",
      date: "Sep 15, 2023",
      duration: "3 hours 15 minutes",
      affectedServices: ["Authentication"],
      impact: "High"
    }
  ];

  // Generate realistic uptime data for the past 90 days
  useEffect(() => {
    const generateUptimeData = () => {
      const data = [];
      for (let i = 90; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // More realistic uptime with occasional dips
        let uptime;
        if (i === 5 || i === 28 || i === 45) {
          // Simulate incidents
          uptime = (99.0 + Math.random() * 0.5).toFixed(2);
        } else if (i === 15 || i === 60) {
          // Simulate maintenance
          uptime = (99.5 + Math.random() * 0.3).toFixed(2);
        } else {
          // Normal operation
          uptime = (99.8 + Math.random() * 0.2).toFixed(2);
        }
        
        data.push({
          date: date.toISOString().split('T')[0],
          uptime: parseFloat(uptime)
        });
      }
      return data;
    };
    
    setUptimeData(generateUptimeData());
    
    // Simulate real-time metrics loading
    const timer = setTimeout(() => {
      setRealTimeMetrics({
        currentUsers: Math.floor(Math.random() * 5000) + 10000,
        apiRequests: Math.floor(Math.random() * 1000) + 5000,
        codeExecutions: Math.floor(Math.random() * 500) + 2000,
        avgResponseTime: Math.floor(Math.random() * 50) + 100
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-emerald-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded Performance';
      case 'down': return 'Service Disruption';
      default: return 'Unknown';
    }
  };

  const getLoadColor = (load) => {
    const loadValue = parseInt(load);
    if (loadValue < 50) return 'text-emerald-400';
    if (loadValue < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIncidentStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400';
      case 'investigating': return 'bg-red-500/20 text-red-400';
      case 'monitoring': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emerald-500 w-3 h-3 rounded-full mr-3 animate-pulse"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  System Status
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time status of all Xalora services. Last updated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="text-gray-400 text-sm mb-1">Active Users</div>
                  <div className="text-2xl font-bold text-white">{realTimeMetrics.currentUsers.toLocaleString()}</div>
                  <div className="text-xs text-emerald-400 mt-1">+2.3% from last hour</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="text-gray-400 text-sm mb-1">API Requests/min</div>
                  <div className="text-2xl font-bold text-white">{realTimeMetrics.apiRequests.toLocaleString()}</div>
                  <div className="text-xs text-emerald-400 mt-1">Stable</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="text-gray-400 text-sm mb-1">Code Executions</div>
                  <div className="text-2xl font-bold text-white">{realTimeMetrics.codeExecutions.toLocaleString()}</div>
                  <div className="text-xs text-yellow-400 mt-1">+5.7% from last hour</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="text-gray-400 text-sm mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold text-white">{realTimeMetrics.avgResponseTime}ms</div>
                  <div className="text-xs text-yellow-400 mt-1">+12ms from avg</div>
                </div>
              </>
            )}
          </div>

          {/* Overall Status */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-12 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02]">
            <div className="inline-flex items-center justify-center bg-emerald-500/20 px-6 py-3 rounded-full mb-6 transition-all duration-300 hover:bg-emerald-500/30">
              <svg className="h-6 w-6 text-emerald-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-emerald-400 font-bold text-lg">All Systems Operational</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              All services are running normally. We're continuously monitoring our infrastructure to ensure 
              the best possible experience for our users.
            </p>
          </div>

          {/* Services Status */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Service Status</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} mr-2 transition-all duration-300`}></div>
                      <span className="text-sm font-medium text-gray-300">{getStatusText(service.status)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Uptime: </span>
                      <span className="text-white font-medium">{service.uptime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Response: </span>
                      <span className="text-white font-medium">{service.responseTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Load: </span>
                      <span className={`font-medium ${getLoadColor(service.load)}`}>{service.load}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Region: </span>
                      <span className="text-white font-medium">{service.region}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Last incident: {service.lastIncident}</span>
                    <span>v{service.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uptime Chart */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-16 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-8">90-Day Uptime History</h2>
            <div className="h-64 flex items-end justify-between space-x-1">
              {uptimeData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t transition-all duration-300 hover:opacity-75 hover:from-emerald-400 hover:to-emerald-200"
                    style={{ height: `${(data.uptime - 99) * 200}px` }}
                    title={`${data.date}: ${data.uptime}%`}
                  ></div>
                  {index % 15 === 0 && (
                    <div className="text-xs text-gray-500 mt-2 transition-colors duration-300 hover:text-gray-300">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center mr-6">
                <div className="w-4 h-4 bg-emerald-500 rounded mr-2"></div>
                <span className="text-gray-400">Uptime Percentage</span>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Recent Incidents</h2>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.01]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-white">{incident.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${getIncidentStatusColor(incident.status)}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${getImpactColor(incident.impact)}`}>
                          {incident.impact} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{incident.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>Date: {incident.date}</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Affected Services: </span>
                      <span className="text-white">
                        {incident.affectedServices.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-12 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                <svg className="h-16 w-16 text-emerald-400 mx-auto mb-4 transition-all duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No Recent Incidents</h3>
                <p className="text-gray-400">All systems have been running smoothly for the past 90 days.</p>
              </div>
            )}
          </div>

          {/* System Health Metrics */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-16 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-8">System Health Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4">Resource Utilization</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">CPU Usage</span>
                      <span className="text-white">67%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Memory Usage</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Disk Usage</span>
                      <span className="text-white">32%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4">Network Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Bandwidth</span>
                      <span className="text-white">2.4 Gbps</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Latency</span>
                      <span className="text-white">89ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Packet Loss</span>
                      <span className="text-white">0.02%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4">Security Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Threats Blocked</span>
                      <span className="text-white">1,243</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Failed Logins</span>
                      <span className="text-white">42</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Vulnerabilities</span>
                      <span className="text-white">0</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20 p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Informed</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get notified about system maintenance, outages, and other important updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300 hover:border-emerald-400/30"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 whitespace-nowrap hover:scale-105 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Status;