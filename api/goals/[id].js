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
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Configurazione Upstash mancante' });
    }

    switch (req.method) {
      case 'DELETE':
        // Elimina un obiettivo
        console.log('Eliminazione goal:', id);
        
        const deleteResponse = await fetch(`${url}/hdel/goals/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!deleteResponse.ok) {
          const errorText = await deleteResponse.text();
          console.error('Upstash delete error:', deleteResponse.status, errorText);
          return res.status(500).json({ 
            error: 'Errore Upstash durante eliminazione',
            status: deleteResponse.status,
            details: errorText
          });
        }

        const deleteData = await deleteResponse.json();
        console.log('Delete result:', deleteData);
        
        // Se il risultato è 0, l'obiettivo non esisteva
        if (deleteData.result === 0) {
          return res.status(404).json({ error: 'Goal not found' });
        }

        return res.status(200).json({ message: 'Goal deleted successfully' });

      case 'GET':
        // Recupera un singolo obiettivo
        const getResponse = await fetch(`${url}/hget/goals/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!getResponse.ok) {
          return res.status(500).json({ error: 'Errore Upstash' });
        }

        const getData = await getResponse.json();
        const goalData = getData.result;
        
        if (!goalData) {
          return res.status(404).json({ error: 'Goal not found' });
        }

        return res.status(200).json(JSON.parse(goalData));

      case 'PUT':
        // Aggiorna un obiettivo
        const existingGoalResponse = await fetch(`${url}/hget/goals/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!existingGoalResponse.ok) {
          return res.status(500).json({ error: 'Errore Upstash' });
        }

        const existingGoalData = await existingGoalResponse.json();
        const existingGoal = existingGoalData.result ? JSON.parse(existingGoalData.result) : null;
        
        if (!existingGoal) {
          return res.status(404).json({ error: 'Goal not found' });
        }

        const updateData = { ...req.body };
        delete updateData.id;
        delete updateData._id;
        
        const updatedGoal = {
          ...existingGoal,
          ...updateData,
          updatedAt: new Date().toISOString()
        };

        // Salva l'obiettivo aggiornato
        const updateResponse = await fetch(`${url}/hset/goals/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(JSON.stringify(updatedGoal))
        });

        if (!updateResponse.ok) {
          return res.status(500).json({ error: 'Errore durante aggiornamento' });
        }

        return res.status(200).json(updatedGoal);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}