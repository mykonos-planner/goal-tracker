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
      return false;
    }
    
    const goalStartDate = new Date(goal.startDate);
    goalStartDate.setHours(0, 0, 0, 0);
    
    // Se l'obiettivo inizia dopo oggi, non mostrarlo
    if (goalStartDate > today) {
      return false;
    }
    
    const daysSinceStart = Math.floor((today - goalStartDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart >= goal.duration) {
      return false;
    }
    
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
      alignItems: 'flex-start',
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
      alignItems: 'flex-start',
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
      flexShrink: 0,
      marginTop: '2px',
    },
    goalContent: {
      flex: 1,
      minWidth: '200px',
    },
    goalName: {
      fontSize: '14px',
      color: '#00ff00',
      letterSpacing: '0.5px',
      marginBottom: '5px',
    },
    goalDescription: {
      fontSize: '11px',
      color: '#00cc00',
      opacity: '0.8',
      letterSpacing: '0.5px',
      marginTop: '10px',
      padding: '8px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      width: '100%',
    },
    goalInfo: {
      fontSize: '11px',
      color: '#00cc00',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
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
  };

  if (todaysGoals.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>
          [ TODAY - {todayFormatted.toUpperCase()} ]
        </h2>
        <p style={styles.emptyMessage}>
          [ NO TASKS SCHEDULED FOR TODAY ]
        </p>
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
            <div style={styles.goalContent}>
              <span style={styles.goalName}>
                {goal.name || 'UNTITLED'}
                <span style={styles.expandIndicator}>
                  {isExpanded ? ' [-]' : ' [+]'}
                </span>
              </span>
              {isExpanded && goal.description && (
                <div style={styles.goalDescription}>
                  {goal.description}
                </div>
              )}
            </div>
            <span style={styles.goalInfo}>
              {completed ? '[✓ DONE]' : '[PENDING]'}
            </span>
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
    </div>
  );
}

export default TodayView;