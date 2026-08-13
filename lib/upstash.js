// Versione semplificata e robusta
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstashRequest(path, options = {}) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    throw new Error('Configurazione Upstash mancante');
  }

  const response = await fetch(`${UPSTASH_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstash error: ${response.status}`);
  }

  return await response.json();
}

export async function getAllGoals() {
  try {
    const data = await upstashRequest('/hgetall/goals');
    
    // Upstash può restituire diversi formati
    const result = data.result || data;
    
    if (!result) return [];
    
    const goals = [];
    
    // Se è un array [key1, value1, key2, value2, ...]
    if (Array.isArray(result)) {
      for (let i = 0; i < result.length; i += 2) {
        if (result[i + 1]) {
          try {
            const goal = JSON.parse(result[i + 1]);
            goals.push(goal);
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }
    // Se è un oggetto {key1: value1, key2: value2}
    else if (typeof result === 'object') {
      for (const [key, value] of Object.entries(result)) {
        try {
          const goal = JSON.parse(value);
          goals.push(goal);
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
    
    return goals;
  } catch (error) {
    console.error('getAllGoals error:', error);
    throw error;
  }
}

export async function saveGoal(goalId, goalData) {
  const data = await upstashRequest(`/hset/goals/${goalId}`, {
    method: 'POST',
    body: JSON.stringify(JSON.stringify(goalData)),
  });
  return data.result;
}

export async function getGoal(goalId) {
  const data = await upstashRequest(`/hget/goals/${goalId}`);
  const result = data.result;
  return result ? JSON.parse(result) : null;
}

export async function deleteGoal(goalId) {
  const data = await upstashRequest(`/hdel/goals/${goalId}`);
  return data.result;
}

export async function updateGoal(goalId, goalData) {
  return await saveGoal(goalId, goalData);
}