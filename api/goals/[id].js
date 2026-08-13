export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST, OPTIONS');
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
      case 'POST':
        // Verifica se è una DELETE o una POST per l'eliminazione
        if (req.method === 'DELETE' || req.body?.action === 'delete') {
          console.log('Eliminazione goal:', id);
          
          // Usa il metodo POST con il comando HDEL
          const deleteResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(["HDEL", "goals", id])
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
        }
        return res.status(400).json({ error: 'Bad request' });

      case 'GET':
        // Recupera un singolo obiettivo
        const getResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(["HGET", "goals", id])
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

        return res.status(200).json(JSON.parse(goalData));

      case 'PUT':
        // Aggiorna un obiettivo
        const existingGoalResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(["HGET", "goals", id])
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

        // Salva l'obiettivo aggiornato usando HSET
        const updateResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(["HSET", "goals", id, JSON.stringify(updatedGoal)])
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