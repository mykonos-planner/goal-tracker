import { getAllGoals, saveGoal } from '../../lib/upstash';

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
      const goals = await getAllGoals();
      return res.status(200).json(goals);
    }

    if (req.method === 'POST') {
      const { name, duration } = req.body;
      
      if (!name || !duration) {
        return res.status(400).json({ error: 'Dati mancanti' });
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

      await saveGoal(goalId, newGoal);
      return res.status(201).json(newGoal);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error.message,
      configured: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    });
  }
}