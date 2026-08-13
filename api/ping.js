export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: 'API funzionante!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    upstashUrlExists: !!process.env.UPSTASH_REDIS_REST_URL,
    upstashTokenExists: !!process.env.UPSTASH_REDIS_REST_TOKEN
  });
}