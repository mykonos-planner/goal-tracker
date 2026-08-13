export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Verifica la configurazione
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      
      if (!url || !token) {
        return res.status(500).json({
          error: 'Configurazione Upstash mancante',
          hasUrl: !!url,
          hasToken: !!token,
          envVars: Object.keys(process.env).filter(k => k.includes('UPSTASH'))
        });
      }
      
      // Prova a fare la richiesta a Upstash
      const response = await fetch(`${url}/hgetall/goals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(500).json({
          error: 'Errore Upstash',
          status: response.status,
          details: errorText,
          url: url.substring(0, 30) + '...'
        });
      }
      
      const data = await response.json();
      
      // Estrai i goals dalla risposta
      const result = data.result || data;
      const goals = [];
      
      if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i += 2) {
          if (result[i + 1]) {
            try {
              goals.push(JSON.parse(result[i + 1]));
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
      
      return res.status(200).json(goals);
    }
    
    if (req.method === 'POST') {
      const { name, duration } = req.body;
      
      if (!name || !duration) {
        return res.status(400).json({ error: 'Dati mancanti' });
      }
      
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      
      if (!url || !token) {
        return res.status(500).json({ error: 'Configurazione Upstash mancante' });
      }
      
      const goalId = `goal_${Date.now()}`;
      const newGoal = {
        id: goalId,
        name,
        duration: parseInt(duration),
        startDate: new Date().toISOString(),
        dailyHistory: [],
        checkedToday: false,
        createdAt: new Date().toISOString()
      };
      
      // Salva su Upstash
      const saveResponse = await fetch(`${url}/hset/goals/${goalId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSON.stringify(newGoal))
      });
      
      if (!saveResponse.ok) {
        throw new Error('Errore nel salvataggio');
      }
      
      return res.status(201).json(newGoal);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}