export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: 'Configurazione Upstash mancante' });
    }

    console.log('Eliminazione di tutti gli obiettivi...');

    // Elimina l'intera hash "goals" usando DEL
    const deleteResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(["DEL", "goals"])
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Upstash DEL error:', deleteResponse.status, errorText);
      return res.status(500).json({ 
        error: 'Errore durante l\'eliminazione',
        status: deleteResponse.status,
        details: errorText
      });
    }

    const deleteData = await deleteResponse.json();
    console.log('Risultato eliminazione:', deleteData);

    return res.status(200).json({ 
      message: 'Tutti gli obiettivi eliminati con successo',
      result: deleteData.result
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}