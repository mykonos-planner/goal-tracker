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

    if (req.method === 'PUT') {
      const getResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HGET", "network_groups", id])
      });

      if (!getResponse.ok) {
        return res.status(500).json({ error: 'Errore Upstash' });
      }

      const getData = await getResponse.json();
      const existingGroup = getData.result ? JSON.parse(getData.result) : null;

      if (!existingGroup) {
        return res.status(404).json({ error: 'Gruppo non trovato' });
      }

      const updatedGroup = {
        ...existingGroup,
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      const updateResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HSET", "network_groups", id, JSON.stringify(updatedGroup)])
      });

      if (!updateResponse.ok) {
        return res.status(500).json({ error: 'Errore nell\'aggiornamento' });
      }

      return res.status(200).json(updatedGroup);
    }

    if (req.method === 'DELETE') {
      const deleteResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["HDEL", "network_groups", id])
      });

      if (!deleteResponse.ok) {
        return res.status(500).json({ error: 'Errore nell\'eliminazione' });
      }

      return res.status(200).json({ message: 'Gruppo eliminato con successo' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}