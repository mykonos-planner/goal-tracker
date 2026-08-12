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
        console.log('Fetching goals from Upstash...');
        const goals = await getAllGoals();
        console.log('Goals fetched:', goals.length);
        res.status(200).json(goals);
        break;

      case 'POST':
        const { name, duration } = req.body;
        
        console.log('Creating goal:', { name, duration });
        
        if (!name || !duration) {
          return res.status(400).json({ error: 'Name and duration are required' });
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
        console.log('Goal saved successfully:', goalId);
        
        res.status(201).json(newGoal);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}