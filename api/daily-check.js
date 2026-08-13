export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { goalId, checked } = req.body;
    
    if (!goalId) {
      return res.status(400).json({ error: 'Goal ID is required' });
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Configurazione Upstash mancante' });
    }

    console.log('Toggle check:', { goalId, checked });

    // Recupera l'obiettivo
    const getResponse = await fetch(`${url}/hget/goals/${goalId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('Upstash GET error:', getResponse.status, errorText);
      return res.status(500).json({ 
        error: 'Errore Upstash',
        status: getResponse.status,
        details: errorText
      });
    }

    const getData = await getResponse.json();
    const goalData = getData.result;
    
    if (!goalData) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = JSON.parse(goalData);
    const today = new Date().toDateString();
    let dailyHistory = Array.isArray(goal.dailyHistory) ? [...goal.dailyHistory] : [];

    if (checked && !dailyHistory.includes(today)) {
      dailyHistory.push(today);
    } else if (!checked) {
      dailyHistory = dailyHistory.filter(date => date !== today);
    }

    const updatedGoal = {
      ...goal,
      checkedToday: checked,
      dailyHistory,
      updatedAt: new Date().toISOString()
    };

    // Salva l'obiettivo aggiornato
    const updateResponse = await fetch(`${url}/hset/goals/${goalId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(updatedGoal))
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Upstash UPDATE error:', updateResponse.status, errorText);
      return res.status(500).json({ 
        error: 'Errore durante aggiornamento',
        status: updateResponse.status,
        details: errorText
      });
    }

    console.log('Goal aggiornato con successo');
    return res.status(200).json(updatedGoal);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}