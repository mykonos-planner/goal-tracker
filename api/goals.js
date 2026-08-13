export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Configurazione Upstash mancante' });
    }

    if (req.method === 'GET') {
      console.log('Recupero obiettivi...');
      
      // Usa il formato POST con comando Redis
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HGETALL", "goals"])
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upstash GET error:', response.status, errorText);
        return res.status(500).json({ 
          error: 'Errore Upstash',
          status: response.status,
          details: errorText
        });
      }

      const data = await response.json();
      console.log('Risposta Upstash:', data);
      
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

      goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log('Goals recuperati:', goals.length);
      return res.status(200).json(goals);
    }

    if (req.method === 'POST') {
      const { name, duration } = req.body;
      
      console.log('Creazione goal:', { name, duration });
      
      if (!name || !duration) {
        return res.status(400).json({ error: 'Dati mancanti' });
      }

      const goalId = Date.now().toString();
      const newGoal = {
        id: goalId,
        name,
        duration: parseInt(duration),
        startDate: new Date().toISOString(),
        dailyHistory: [],
        checkedToday: false,
        createdAt: new Date().toISOString()
      };

      // Salva su Upstash usando HSET
      const saveResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HSET", "goals", goalId, JSON.stringify(newGoal)])
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error('Upstash POST error:', saveResponse.status, errorText);
        return res.status(500).json({ 
          error: 'Errore nel salvataggio',
          status: saveResponse.status,
          details: errorText
        });
      }

      const saveData = await saveResponse.json();
      console.log('Risposta salvataggio:', saveData);

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