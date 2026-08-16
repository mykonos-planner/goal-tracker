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
    const { goalId, checked, date } = req.body;
    
    if (!goalId) {
      return res.status(400).json({ error: 'Goal ID is required' });
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Configurazione Upstash mancante' });
    }

    // Recupera l'obiettivo
    const getResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(["HGET", "goals", goalId])
    });

    if (!getResponse.ok) {
      return res.status(500).json({ error: 'Errore Upstash' });
    }

    const getData = await getResponse.json();
    const goalData = getData.result;
    
    if (!goalData) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const goal = JSON.parse(goalData);
    
    // Usa la data fornita o quella di oggi
    const targetDate = date || new Date().toDateString();
    let dailyHistory = Array.isArray(goal.dailyHistory) ? [...goal.dailyHistory] : [];

    if (checked && !dailyHistory.includes(targetDate)) {
      dailyHistory.push(targetDate);
    } else if (!checked) {
      dailyHistory = dailyHistory.filter(d => d !== targetDate);
    }

    const updatedGoal = {
      ...goal,
      checkedToday: targetDate === new Date().toDateString() ? checked : goal.checkedToday,
      dailyHistory,
      updatedAt: new Date().toISOString()
    };

    // Salva l'obiettivo aggiornato
    const updateResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(["HSET", "goals", goalId, JSON.stringify(updatedGoal)])
    });

    if (!updateResponse.ok) {
      return res.status(500).json({ error: 'Errore durante aggiornamento' });
    }

    return res.status(200).json(updatedGoal);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}