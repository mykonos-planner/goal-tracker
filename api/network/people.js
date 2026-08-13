export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HGETALL", "network_people"])
      });

      if (!response.ok) {
        return res.status(500).json({ error: 'Errore Upstash' });
      }

      const data = await response.json();
      const result = data.result || [];
      const people = [];

      if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i += 2) {
          if (result[i + 1]) {
            try {
              people.push(JSON.parse(result[i + 1]));
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      return res.status(200).json(people);
    }

    if (req.method === 'POST') {
      const { name, surname, relationship, metWhen, why } = req.body;
      
      if (!name || !surname) {
        return res.status(400).json({ error: 'Nome e cognome sono obbligatori' });
      }

      const personId = `person_${Date.now()}`;
      const newPerson = {
        id: personId,
        name,
        surname,
        relationship: relationship || 'friend',
        metWhen: metWhen || '',
        why: why || '',
        createdAt: new Date().toISOString(),
      };

      const saveResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HSET", "network_people", personId, JSON.stringify(newPerson)])
      });

      if (!saveResponse.ok) {
        return res.status(500).json({ error: 'Errore nel salvataggio' });
      }

      return res.status(201).json(newPerson);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}