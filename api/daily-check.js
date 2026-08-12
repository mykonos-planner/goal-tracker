import { getGoal, updateGoal } from '../../lib/upstash';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { goalId, checked } = req.body;
    
    if (!goalId) {
      res.status(400).json({ error: 'Goal ID is required' });
      return;
    }

    // Recupera l'obiettivo
    const goal = await getGoal(goalId);
    
    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    const today = new Date().toDateString();
    let dailyHistory = [...(goal.dailyHistory || [])];

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

    await updateGoal(goalId, updatedGoal);
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error('Upstash error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}