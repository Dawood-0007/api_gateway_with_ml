// Mock data for the WAF Security Dashboard

export const generateTimeSeriesData = (hours: number, interval: number = 5) => {
  const data = [];
  const now = new Date();
  for (let i = hours * 60; i >= 0; i -= interval) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.toISOString(),
      normal: Math.floor(Math.random() * 80 + 40),
      malicious: Math.floor(Math.random() * 15 + 2),
      total: 0,
    });
    data[data.length - 1].total = data[data.length - 1].normal + data[data.length - 1].malicious;
  }
  return data;
};

export const overviewStats = {
  totalRequests24h: 48_293,
  maliciousRequests: 1_847,
  maliciousPercent: 3.8,
  blockedIPs: 23,
  requestsPerMinute: 34,
  avgAnomalyScore: 0.23,
};

export const maliciousVsNormal = [
  { name: 'Normal', value: 46446, fill: 'hsl(152, 60%, 45%)' },
  { name: 'Malicious', value: 1847, fill: 'hsl(0, 72%, 51%)' },
];

export const topEndpoints = [
  { endpoint: '/api/login', hits: 12480, method: 'POST' },
  { endpoint: '/api/users', hits: 8932, method: 'GET' },
  { endpoint: '/api/data', hits: 7215, method: 'GET' },
  { endpoint: '/api/upload', hits: 4891, method: 'POST' },
  { endpoint: '/api/search', hits: 3567, method: 'GET' },
  { endpoint: '/api/webhook', hits: 2103, method: 'POST' },
  { endpoint: '/api/auth/token', hits: 1892, method: 'POST' },
  { endpoint: '/api/settings', hits: 1456, method: 'PUT' },
];

export const httpMethods = [
  { method: 'GET', count: 24310, fill: 'hsl(152, 60%, 45%)' },
  { method: 'POST', count: 18420, fill: 'hsl(210, 70%, 50%)' },
  { method: 'PUT', count: 3200, fill: 'hsl(38, 92%, 50%)' },
  { method: 'DELETE', count: 2363, fill: 'hsl(0, 72%, 51%)' },
];

export const requestsByIP = [
  { ip: '192.168.1.105', requests: 4521, country: 'US' },
  { ip: '10.0.0.42', requests: 3892, country: 'DE' },
  { ip: '172.16.0.88', requests: 2743, country: 'CN' },
  { ip: '203.0.113.50', requests: 2198, country: 'RU' },
  { ip: '198.51.100.23', requests: 1876, country: 'BR' },
  { ip: '192.0.2.1', requests: 1543, country: 'IN' },
];

export interface ThreatEntry {
  id: string;
  ip: string;
  endpoint: string;
  anomalyScore: number;
  timestamp: string;
  method: string;
  payload?: string;
  status: number;
  country: string;
}

export const maliciousRequests: ThreatEntry[] = [
  { id: '1', ip: '203.0.113.50', endpoint: '/api/login', anomalyScore: 0.97, timestamp: '2026-03-02T14:23:11Z', method: 'POST', payload: "' OR 1=1 --", status: 403, country: 'RU' },
  { id: '2', ip: '198.51.100.23', endpoint: '/api/users', anomalyScore: 0.92, timestamp: '2026-03-02T14:21:45Z', method: 'GET', payload: '../../../etc/passwd', status: 403, country: 'CN' },
  { id: '3', ip: '172.16.0.88', endpoint: '/api/upload', anomalyScore: 0.89, timestamp: '2026-03-02T14:19:30Z', method: 'POST', payload: '<script>alert("xss")</script>', status: 403, country: 'BR' },
  { id: '4', ip: '10.0.0.42', endpoint: '/api/login', anomalyScore: 0.85, timestamp: '2026-03-02T14:17:22Z', method: 'POST', status: 429, country: 'DE' },
  { id: '5', ip: '203.0.113.50', endpoint: '/api/auth/token', anomalyScore: 0.82, timestamp: '2026-03-02T14:15:10Z', method: 'POST', status: 403, country: 'RU' },
  { id: '6', ip: '192.0.2.1', endpoint: '/api/data', anomalyScore: 0.78, timestamp: '2026-03-02T14:12:55Z', method: 'GET', payload: 'UNION SELECT * FROM users', status: 403, country: 'IN' },
  { id: '7', ip: '198.51.100.23', endpoint: '/api/webhook', anomalyScore: 0.74, timestamp: '2026-03-02T14:10:33Z', method: 'POST', status: 403, country: 'CN' },
  { id: '8', ip: '172.16.0.88', endpoint: '/api/settings', anomalyScore: 0.71, timestamp: '2026-03-02T14:08:18Z', method: 'PUT', status: 403, country: 'BR' },
  { id: '9', ip: '10.0.0.42', endpoint: '/api/login', anomalyScore: 0.68, timestamp: '2026-03-02T14:05:44Z', method: 'POST', status: 429, country: 'DE' },
  { id: '10', ip: '203.0.113.50', endpoint: '/api/search', anomalyScore: 0.65, timestamp: '2026-03-02T14:03:21Z', method: 'GET', payload: '; DROP TABLE users;', status: 403, country: 'RU' },
];

export interface BlockedIP {
  id: string;
  ip: string;
  reason: string;
  blockedAt: string;
  country: string;
  requestCount: number;
}

export const blockedIPs: BlockedIP[] = [
  { id: '1', ip: '203.0.113.50', reason: 'SQL Injection attempts', blockedAt: '2026-03-02T12:00:00Z', country: 'RU', requestCount: 342 },
  { id: '2', ip: '198.51.100.23', reason: 'Path traversal attack', blockedAt: '2026-03-02T11:30:00Z', country: 'CN', requestCount: 218 },
  { id: '3', ip: '172.16.0.88', reason: 'XSS payload detected', blockedAt: '2026-03-02T10:45:00Z', country: 'BR', requestCount: 156 },
  { id: '4', ip: '10.0.0.42', reason: 'Brute force login', blockedAt: '2026-03-02T09:15:00Z', country: 'DE', requestCount: 891 },
  { id: '5', ip: '192.0.2.1', reason: 'SQL Injection attempts', blockedAt: '2026-03-02T08:30:00Z', country: 'IN', requestCount: 124 },
  { id: '6', ip: '45.33.32.156', reason: 'DDoS participation', blockedAt: '2026-03-01T22:10:00Z', country: 'US', requestCount: 5420 },
  { id: '7', ip: '104.236.198.48', reason: 'Suspicious scanning', blockedAt: '2026-03-01T20:45:00Z', country: 'NL', requestCount: 780 },
];

export const anomalyDistribution = [
  { range: '0.0-0.2', count: 38200 },
  { range: '0.2-0.4', count: 6800 },
  { range: '0.4-0.6', count: 1900 },
  { range: '0.6-0.8', count: 980 },
  { range: '0.8-1.0', count: 413 },
];

export const mlMetrics = {
  modelVersion: 'v2.4.1',
  lastTrained: '2026-02-28T00:00:00Z',
  accuracy: 97.3,
  precision: 96.8,
  recall: 94.2,
  f1Score: 95.5,
  totalEvaluated: 48293,
  threshold: 0.65,
};

export const anomalyScoreTimeline = () => {
  const data = [];
  for (let i = 24; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    data.push({
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit' }),
      avgScore: +(Math.random() * 0.3 + 0.15).toFixed(3),
      maxScore: +(Math.random() * 0.4 + 0.55).toFixed(3),
    });
  }
  return data;
};

export const modelDecisionDistribution = [
  { decision: 'Allow', count: 46446, fill: 'hsl(152, 60%, 45%)' },
  { decision: 'Flag', count: 1234, fill: 'hsl(38, 92%, 50%)' },
  { decision: 'Block', count: 613, fill: 'hsl(0, 72%, 51%)' },
];

export interface RequestLog {
  id: string;
  ip: string;
  endpoint: string;
  method: string;
  status: number;
  anomalyScore: number;
  timestamp: string;
  isMalicious: boolean;
  responseTime: number;
}

export const requestLogs: RequestLog[] = Array.from({ length: 50 }, (_, i) => {
  const isMalicious = Math.random() > 0.85;
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const endpoints = ['/api/login', '/api/users', '/api/data', '/api/upload', '/api/search', '/api/webhook', '/api/auth/token', '/api/settings'];
  const ips = ['192.168.1.105', '10.0.0.42', '172.16.0.88', '203.0.113.50', '198.51.100.23', '192.0.2.1', '45.33.32.156'];
  const d = new Date();
  d.setMinutes(d.getMinutes() - i * 3);
  return {
    id: String(i + 1),
    ip: ips[Math.floor(Math.random() * ips.length)],
    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
    status: isMalicious ? (Math.random() > 0.5 ? 403 : 429) : 200,
    anomalyScore: isMalicious ? +(Math.random() * 0.4 + 0.6).toFixed(2) : +(Math.random() * 0.3).toFixed(2),
    timestamp: d.toISOString(),
    isMalicious,
    responseTime: Math.floor(Math.random() * 200 + 10),
  };
});

export const adminUsers = [
  { id: '1', name: 'Admin User', email: 'admin@sentinel.io', role: 'admin', lastLogin: '2026-03-02T14:00:00Z' },
  { id: '2', name: 'Security Analyst', email: 'analyst@sentinel.io', role: 'viewer', lastLogin: '2026-03-02T12:30:00Z' },
  { id: '3', name: 'DevOps Engineer', email: 'devops@sentinel.io', role: 'admin', lastLogin: '2026-03-01T18:00:00Z' },
];
