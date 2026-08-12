// Helper per interagire con l'API REST di Upstash Redis

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

export async function getGoal(goalId) {
  const result = await upstashCommand('HGET', 'goals', goalId);
  return result ? JSON.parse(result) : null;
}

export async function getAllGoals() {
  try {
    const result = await upstashCommand('HGETALL', 'goals');
    const goals = [];
    
    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i += 2) {
        try {
          const goalData = JSON.parse(result[i + 1]);
          goals.push(goalData);
        } catch (parseError) {
          console.error('Error parsing goal:', parseError);
        }
      }
    }
    
    goals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return goals;
  } catch (error) {
    console.error('Error getting all goals:', error);
    return [];
  }
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