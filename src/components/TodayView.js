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
      padding: '15px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      fontFamily: "'Courier New', monospace",
      width: '100%',
      boxSizing: 'border-box',
    },
    header: {
      color: '#00ff00',
      marginBottom: '15px',
      fontSize: '1em',
      letterSpacing: '1px',
      borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
      paddingBottom: '10px',
    },
    goalItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      gap: '8px',
      width: '100%',
      boxSizing: 'border-box',
    },
    goalItemExpanded: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid #00ff00',
      gap: '8px',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
      flexWrap: 'wrap',
    },
    colorDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
      flexShrink: 0,
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#00ff00',
      flexShrink: 0,
    },
    goalContent: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    goalName: {
      fontSize: '13px',
      color: '#00ff00',
      letterSpacing: '0.5px',
      marginBottom: '3px',
      wordBreak: 'break-word',
    },
    goalDescription: {
      fontSize: '10px',
      color: '#00cc00',
      opacity: '0.8',
      letterSpacing: '0.5px',
      marginTop: '5px',
      padding: '8px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
    },
    goalInfo: {
      fontSize: '10px',
      color: '#00cc00',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    expandIndicator: {
      color: '#00ff00',
      fontSize: '9px',
      marginLeft: '3px',
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#00cc00',
      padding: '20px',
      fontSize: '13px',
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
      marginTop: '15px',
      padding: '12px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      textAlign: 'center',
    },
    progressText: {
      color: '#00ff00',
      fontSize: '12px',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    progressBar: {
      width: '100%',
      height: '8px',
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
          <div key={goalId}>
            <div
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
                  boxShadow: `0 0 3px ${goalColor}`,
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
              </div>
              <span style={styles.goalInfo}>
                {completed ? '[✓]' : '[ ]'}
              </span>
            </div>
            
            {isExpanded && goal.description && (
              <div style={{
                ...styles.goalDescription,
                marginTop: '-4px',
                marginBottom: '8px',
                marginLeft: '35px',
                width: 'calc(100% - 35px)',
                boxSizing: 'border-box',
              }}>
                {goal.description}
              </div>
            )}
          </div>
        );
      })}

      <div style={styles.progressSummary}>
        <div style={styles.progressText}>
          [ {completedCount}/{todaysGoals.length} COMPLETED ]
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