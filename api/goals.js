import { getAllGoals, saveGoal } from '../../lib/upstash';

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        // Recupera tutti gli obiettivi
        const goals = await getAllGoals();
        res.status(200).json(goals);
        break;

      case 'POST':
        // Crea un nuovo obiettivo
        const { name, duration } = req.body;
        
        if (!name || !duration) {
          res.status(400).json({ error: 'Name and duration are required' });
          return;
        }

        const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        res.status(201).json(newGoal);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Upstash error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}