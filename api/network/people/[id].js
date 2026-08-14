export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Configurazione Upstash mancante' });
    }

    const deleteResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(["HDEL", "network_people", id])
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      return res.status(500).json({ 
        error: 'Errore nell\'eliminazione',
        details: errorText
      });
    }

    const deleteData = await deleteResponse.json();
    
    if (deleteData.result === 0) {
      return res.status(404).json({ error: 'Persona non trovata' });
    }

    return res.status(200).json({ message: 'Persona eliminata con successo' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}