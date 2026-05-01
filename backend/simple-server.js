const http = require('http');

// Simple in-memory database
let users = [
  { id: 1, phone: '09123456789', name: 'John Resident', type: 'resident' },
  { id: 2, phone: '09987654321', name: 'Jane Collector', type: 'collector' }
];

let schedules = [
  { id: 1, title: 'Biodegradable Collection', waste_type: 'biodegradable', date: '2026-05-01', time: '08:00' },
  { id: 2, title: 'Recyclables Collection', waste_type: 'recyclable', date: '2026-05-02', time: '09:00' }
];

let routes = [
  { id: 1, name: 'Route A', stops: [
    { id: 1, name: 'Stop 1', lat: 8.962216, lng: 125.535944, status: 'pending' },
    { id: 2, name: 'Stop 2', lat: 8.963216, lng: 125.536944, status: 'completed' }
  ]}
];

// Create server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Parse URL
  const url = req.url.split('?')[0];
  const method = req.method;

  // Health check
  if (url === '/health' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'BasuraSmart Backend Running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }

  // API Routes
  if (url.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    if (url === '/api/users' && method === 'GET') {
      res.end(JSON.stringify({
        success: true,
        message: 'Users retrieved',
        data: users
      }));
    }
    else if (url === '/api/schedules' && method === 'GET') {
      res.end(JSON.stringify({
        success: true,
        message: 'Schedules retrieved',
        data: schedules
      }));
    }
    else if (url === '/api/routes' && method === 'GET') {
      res.end(JSON.stringify({
        success: true,
        message: 'Routes retrieved',
        data: routes
      }));
    }
    else if (url === '/api/auth/login' && method === 'POST') {
      res.end(JSON.stringify({
        success: true,
        message: 'OTP sent (mock)',
        data: { expires_in: 600 }
      }));
    }
    else {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        message: 'Endpoint not found'
      }));
    }
    return;
  }

  // Default response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>🚀 BasuraSmart Backend Server</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><a href="/health">Health Check</a></li>
      <li><a href="/api/users">API Users</a></li>
      <li><a href="/api/schedules">API Schedules</a></li>
      <li><a href="/api/routes">API Routes</a></li>
    </ul>
    <p><strong>Server Status:</strong> Running on port 3000</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
  `);
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log('🚀 BasuraSmart Backend Server running!');
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📅 Schedules API: http://localhost:${PORT}/api/schedules`);
  console.log(`🗺️ Routes API: http://localhost:${PORT}/api/routes`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
});

console.log('Starting server...');
