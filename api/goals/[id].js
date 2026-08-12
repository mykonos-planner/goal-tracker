import { getGoal, updateGoal, deleteGoal } from '../../../lib/upstash';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        // Recupera un singolo obiettivo
        const goal = await getGoal(id);
        
        if (!goal) {
          res.status(404).json({ error: 'Goal not found' });
          return;
        }
        
        res.status(200).json(goal);
        break;

      case 'PUT':
        // Aggiorna un obiettivo
        const existingGoal = await getGoal(id);
        
        if (!existingGoal) {
          res.status(404).json({ error: 'Goal not found' });
          return;
        }

        const updateData = { ...req.body };
        delete updateData.id;
        
        const updatedGoal = {
          ...existingGoal,
          ...updateData,
          updatedAt: new Date().toISOString()
        };

        await updateGoal(id, updatedGoal);
        res.status(200).json(updatedGoal);
        break;

      case 'DELETE':
        // Elimina un obiettivo
        const result = await deleteGoal(id);
        
        if (result === 0) {
          res.status(404).json({ error: 'Goal not found' });
          return;
        }
        
        res.status(200).json({ message: 'Goal deleted successfully' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Upstash error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}