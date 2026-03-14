// Simple API endpoint for Vercel deployment
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'School Management System API',
    status: 'online',
    timestamp: new Date().toISOString()
  });
}