import React, { useState } from 'react';

function TodayView({ goals, onToggleCheck }) {
  const [expandedGoal, setExpandedGoal] = useState(null);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toDateString();
  
  const todayFormatted = today.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const shouldDoGoalToday = (goal) => {
    if (!goal.startDate) {
      console.log('Goal senza startDate:', goal.name);
      return false;
    }
    
    const goalStartDate = new Date(goal.startDate);
    goalStartDate.setHours(0, 0, 0, 0);
    
    console.log('Goal:', goal.name, 'Start:', goalStartDate, 'Today:', today);
    
    // Se l'obiettivo inizia dopo oggi, non mostrarlo
    if (goalStartDate > today) {
      console.log('Goal futuro, non mostrare');
      return false;
    }
    
    // Calcola i giorni trascorsi dall'inizio
    const daysSinceStart = Math.floor((today - goalStartDate) / (1000 * 60 * 60 * 24));
    
    console.log('Days since start:', daysSinceStart, 'Duration:', goal.duration);
    
    // Se l'obiettivo è già finito, non mostrarlo
    if (daysSinceStart >= goal.duration) {
      console.log('Goal finito, non mostrare');
      return false;
    }
    
    // Controlla la frequenza
    switch (goal.frequency) {
      case 'daily':
        return true;
      case 'alternate':
        return daysSinceStart % 2 === 0;
      case 'weekly':
        const dayOfWeek = today.getDay();
        return goal.frequencyDays && goal.frequencyDays.includes(dayOfWeek);
      default:
        return true;
    }
  };

  const isCompletedToday = (goal) => {
    return goal.checkedToday === true || 
           (Array.isArray(goal.dailyHistory) && goal.dailyHistory.includes(todayString));
  };

  const toggleExpand = (goalId) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };

  const todaysGoals = goals.filter(goal => shouldDoGoalToday(goal));
  const completedCount = todaysGoals.filter(goal => isCompletedToday(goal)).length;

  const styles = {
    container: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      padding: '20px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      fontFamily: "'Courier New', monospace",
    },
    header: {
      color: '#00ff00',
      marginBottom: '20px',
      fontSize: '1.1em',
      letterSpacing: '1px',
      borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
      paddingBottom: '15px',
    },
    goalItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      flexWrap: 'wrap',
      gap: '10px',
    },
    goalItemExpanded: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      marginBottom: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid #00ff00',
      flexWrap: 'wrap',
      gap: '10px',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)',
    },
    colorDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '10px',
      verticalAlign: 'middle',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      marginRight: '15px',
      cursor: 'pointer',
      accentColor: '#00ff00',
    },
    goalName: {
      fontSize: '14px',
      color: '#00ff00',
      flex: 1,
      minWidth: '150px',
      letterSpacing: '0.5px',
    },
    goalDescription: {
      fontSize: '11px',
      color: '#00cc00',
      width: '100%',
      opacity: '0.8',
      letterSpacing: '0.5px',
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.1)',
    },
    goalInfo: {
      fontSize: '11px',
      color: '#00cc00',
      marginLeft: 'auto',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
    },
    expandIndicator: {
      color: '#00ff00',
      fontSize: '10px',
      marginLeft: '5px',
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#00cc00',
      padding: '20px',
      fontSize: '14px',
      letterSpacing: '1px',
    },
    completedToday: {
      backgroundColor: 'rgba(0, 255, 0, 0.08)',
      border: '1px solid #00ff00',
    },
    notCompletedToday: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
    },
    progressSummary: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      textAlign: 'center',
    },
    progressText: {
      color: '#00ff00',
      fontSize: '14px',
      letterSpacing: '1px',
      marginBottom: '10px',
    },
    progressBar: {
      width: '100%',
      height: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #003300, #00ff00)',
      transition: 'width 0.5s ease-in-out',
      borderRadius: '2px',
    },
    futureGoalsMessage: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: 'rgba(0, 204, 255, 0.05)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 204, 255, 0.2)',
      textAlign: 'center',
    },
    futureGoalsText: {
      color: '#00ccff',
      fontSize: '11px',
      letterSpacing: '1px',
    },
  };

  const futureGoals = goals.filter(goal => {
    if (!goal.startDate) return false;
    const goalStartDate = new Date(goal.startDate);
    goalStartDate.setHours(0, 0, 0, 0);
    return goalStartDate > today;
  });

  if (todaysGoals.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>
          [ TODAY - {todayFormatted.toUpperCase()} ]
        </h2>
        <p style={styles.emptyMessage}>
          [ NO TASKS SCHEDULED FOR TODAY ]
        </p>
        
        {futureGoals.length > 0 && (
          <div style={styles.futureGoalsMessage}>
            <p style={styles.futureGoalsText}>
              [ {futureGoals.length} TASKS SCHEDULED FOR FUTURE DATES ]
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        [ TODAY - {todayFormatted.toUpperCase()} ]
      </h2>
      
      {todaysGoals.map(goal => {
        const goalId = goal.id || goal._id;
        const completed = isCompletedToday(goal);
        const goalColor = goal.color || '#00ff00';
        const isExpanded = expandedGoal === goalId;
        
        return (
          <div
            key={goalId}
            style={{
              ...(isExpanded ? styles.goalItemExpanded : styles.goalItem),
              ...(completed ? styles.completedToday : styles.notCompletedToday)
            }}
            onClick={() => toggleExpand(goalId)}
          >
            <span 
              style={{
                ...styles.colorDot,
                backgroundColor: goalColor,
                boxShadow: `0 0 5px ${goalColor}`,
              }}
            />
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggleCheck(goalId, !completed)}
              style={styles.checkbox}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{flex: 1}}>
              <span style={styles.goalName}>
                {goal.name || 'UNTITLED'}
                <span style={styles.expandIndicator}>
                  {isExpanded ? ' [-]' : ' [+]'}
                </span>
              </span>
            </div>
            <span style={styles.goalInfo}>
              {completed ? '[✓ DONE]' : '[PENDING]'}
            </span>
            
            {isExpanded && goal.description && (
              <div style={styles.goalDescription}>
                {goal.description}
              </div>
            )}
          </div>
        );
      })}

      <div style={styles.progressSummary}>
        <div style={styles.progressText}>
          [ PROGRESS: {completedCount}/{todaysGoals.length} COMPLETED ]
        </div>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${(completedCount / todaysGoals.length) * 100}%`
          }} />
        </div>
      </div>
      
      {futureGoals.length > 0 && (
        <div style={styles.futureGoalsMessage}>
          <p style={styles.futureGoalsText}>
            [ {futureGoals.length} TASKS SCHEDULED FOR FUTURE DATES ]
          </p>
        </div>
      )}
    </div>
  );
}

export default TodayView;