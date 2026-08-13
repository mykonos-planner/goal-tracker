// Questo file non è più necessario ma lo lasciamo per riferimento
export async function upstashCommand(command, ...args) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Upstash credentials not configured');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([command, ...args]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upstash API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Upstash error: ${data.error}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('Upstash command error:', error);
    throw error;
  }
}