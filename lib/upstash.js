// Helper per interagire con l'API REST di Upstash Redis

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstashCommand(command, ...args) {
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  });

  if (!response.ok) {
    throw new Error(`Upstash API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

// Funzioni utili per il nostro caso d'uso
export async function getGoal(goalId) {
  const result = await upstashCommand('HGET', 'goals', goalId);
  return result ? JSON.parse(result) : null;
}

export async function getAllGoals() {
  const result = await upstashCommand('HGETALL', 'goals');
  const goals = [];
  
  if (result && result.length > 0) {
    for (let i = 0; i < result.length; i += 2) {
      const goalData = JSON.parse(result[i + 1]);
      goals.push(goalData);
    }
  }
  
  // Ordina per data di creazione (più recenti prima)
  goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return goals;
}

export async function saveGoal(goalId, goalData) {
  return await upstashCommand('HSET', 'goals', goalId, JSON.stringify(goalData));
}

export async function deleteGoal(goalId) {
  return await upstashCommand('HDEL', 'goals', goalId);
}

export async function updateGoal(goalId, goalData) {
  return await upstashCommand('HSET', 'goals', goalId, JSON.stringify(goalData));
}

export default upstashCommand;