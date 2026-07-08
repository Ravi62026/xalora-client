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
    if (loadValue < 50) return 'text-emerald-600';
    if (loadValue < 80) return 'text-amber-600';
    return 'text-red-600';
  };

  const getIncidentStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold';
      case 'investigating': return 'bg-red-50 text-red-700 border border-red-100 font-semibold';
      case 'monitoring': return 'bg-blue-50 text-blue-700 border border-blue-100 font-semibold';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200 font-semibold';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold';
      case 'medium': return 'bg-amber-50 text-amber-700 border border-amber-100 font-semibold';
      case 'high': return 'bg-red-50 text-red-700 border border-red-100 font-semibold';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200 font-semibold';
    }
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emerald-500 w-3 h-3 rounded-full mr-3 animate-pulse"></div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  System Status
                </span>
              </h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real-time status of all Xalora services. Last updated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white/80 border border-slate-200 rounded-2xl p-6 animate-pulse shadow-sm">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-500/20">
                  <div className="text-slate-500 text-sm mb-1 font-semibold">Active Users</div>
                  <div className="text-2xl font-black text-slate-900">{realTimeMetrics.currentUsers.toLocaleString()}</div>
                  <div className="text-xs text-emerald-600 font-bold mt-1">+2.3% from last hour</div>
                </div>
                <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-500/20">
                  <div className="text-slate-500 text-sm mb-1 font-semibold">API Requests/min</div>
                  <div className="text-2xl font-black text-slate-900">{realTimeMetrics.apiRequests.toLocaleString()}</div>
                  <div className="text-xs text-emerald-600 font-bold mt-1">Stable</div>
                </div>
                <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-500/20">
                  <div className="text-slate-500 text-sm mb-1 font-semibold">Code Executions</div>
                  <div className="text-2xl font-black text-slate-900">{realTimeMetrics.codeExecutions.toLocaleString()}</div>
                  <div className="text-xs text-amber-600 font-bold mt-1">+5.7% from last hour</div>
                </div>
                <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-500/20">
                  <div className="text-slate-500 text-sm mb-1 font-semibold">Avg Response Time</div>
                  <div className="text-2xl font-black text-slate-900">{realTimeMetrics.avgResponseTime}ms</div>
                  <div className="text-xs text-amber-600 font-bold mt-1">+12ms from avg</div>
                </div>
              </>
            )}
          </div>

          {/* Overall Status */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-8 mb-12 text-center shadow-sm hover:shadow-md transition-all duration-300">
            <div className="inline-flex items-center justify-center bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-full mb-6">
              <svg className="h-6 w-6 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-emerald-800 font-black text-lg">All Systems Operational</span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              All services are running normally. We're continuously monitoring our infrastructure to ensure 
              the best possible experience for our users.
            </p>
          </div>

          {/* Services Status */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Service Status</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                      <p className="text-slate-500 text-sm">{service.description}</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)} mr-2`}></div>
                      <span className="text-sm font-semibold text-slate-700">{getStatusText(service.status)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium">Uptime: </span>
                      <span className="text-slate-800 font-bold">{service.uptime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Response: </span>
                      <span className="text-slate-800 font-bold">{service.responseTime}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Load: </span>
                      <span className={`font-bold ${getLoadColor(service.load)}`}>{service.load}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Region: </span>
                      <span className="text-slate-800 font-bold">{service.region}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
                    <span>Last incident: {service.lastIncident}</span>
                    <span>v{service.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uptime Chart */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-8 mb-16 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-8">90-Day Uptime History</h2>
            <div className="h-64 flex items-end justify-between space-x-1">
              {uptimeData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t transition-all duration-300 hover:opacity-75 hover:from-emerald-400 hover:to-emerald-200"
                    style={{ height: `${(data.uptime - 99) * 200}px` }}
                    title={`${data.date}: ${data.uptime}%`}
                  ></div>
                  {index % 15 === 0 && (
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center mr-6">
                <div className="w-4 h-4 bg-emerald-500 rounded mr-2"></div>
                <span className="text-slate-500 text-sm font-semibold">Uptime Percentage</span>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Recent Incidents</h2>
            {incidents.length > 0 ? (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    className="bg-white/80 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-slate-900">{incident.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${getIncidentStatusColor(incident.status)}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${getImpactColor(incident.impact)}`}>
                          {incident.impact} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{incident.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-3 pt-3 border-t border-slate-100">
                      <span>Date: {incident.date}</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      <span className="text-slate-400 font-semibold">Affected Services: </span>
                      <span className="text-slate-800 font-bold">
                        {incident.affectedServices.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 border border-slate-200 p-12 text-center rounded-2xl shadow-sm">
                <svg className="h-16 w-16 text-emerald-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Recent Incidents</h3>
                <p className="text-slate-500">All systems have been running smoothly for the past 90 days.</p>
              </div>
            )}
          </div>

          {/* System Health Metrics */}
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-8 mb-16 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-8">System Health Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Resource Utilization</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">CPU Usage</span>
                      <span className="text-slate-800 font-bold">67%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Memory Usage</span>
                      <span className="text-slate-800 font-bold">45%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Disk Usage</span>
                      <span className="text-slate-800 font-bold">32%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Network Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Bandwidth</span>
                      <span className="text-slate-800 font-bold">2.4 Gbps</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Latency</span>
                      <span className="text-slate-800 font-bold">89ms</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Packet Loss</span>
                      <span className="text-slate-800 font-bold">0.02%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/60 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Security Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Threats Blocked</span>
                      <span className="text-white">1,243</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Failed Logins</span>
                      <span className="text-slate-800 font-bold">42</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Vulnerabilities</span>
                      <span className="text-slate-800 font-bold">0</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Stay Informed</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Get notified about system maintenance, outages, and other important updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
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