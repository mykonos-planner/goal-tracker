import React from 'react';

function DailyCheck({ goals, onToggleCheck }) {
  const today = new Date();
  const todayString = today.toDateString();
  
  const todayFormatted = today.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const styles = {
    container: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      padding: '20px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      marginBottom: '30px',
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
    goalInfo: {
      fontSize: '11px',
      color: '#00cc00',
      marginLeft: 'auto',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
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

  if (!Array.isArray(goals) || goals.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.emptyMessage}>
          [ NO TASKS AVAILABLE ]
        </p>
      </div>
    );
  }

  const isCompletedToday = (goal) => {
    return goal.checkedToday === true || 
           (Array.isArray(goal.dailyHistory) && goal.dailyHistory.includes(todayString));
  };

  const completedCount = goals.filter(goal => isCompletedToday(goal)).length;
  const totalCount = goals.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        [ DAILY CHECK - {todayFormatted.toUpperCase()} ]
      </h2>
      
      {goals.map(goal => {
        if (!goal || (!goal.id && !goal._id)) {
          return null;
        }
        
        const goalId = goal.id || goal._id;
        const completed = isCompletedToday(goal);
        const dailyHistory = Array.isArray(goal.dailyHistory) ? goal.dailyHistory : [];
        
        return (
          <div
            key={goalId}
            style={{
              ...styles.goalItem,
              ...(completed ? styles.completedToday : styles.notCompletedToday)
            }}
            onClick={() => onToggleCheck(goalId, !completed)}
            onMouseEnter={(e) => {
              if (!completed) e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = completed ? 'rgba(0, 255, 0, 0.08)' : 'rgba(0, 255, 0, 0.02)';
            }}
          >
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onToggleCheck(goalId, !completed)}
              style={styles.checkbox}
              onClick={(e) => e.stopPropagation()}
            />
            <span style={styles.goalName}>
              {goal.name || 'UNTITLED'}
            </span>
            <span style={styles.goalInfo}>
              {completed 
                ? '[✓ DONE]' 
                : `[PENDING - ${dailyHistory.length}/${goal.duration || 0}]`}
            </span>
          </div>
        );
      })}

      <div style={styles.progressSummary}>
        <div style={styles.progressText}>
          [ PROGRESS: {completedCount}/{totalCount} COMPLETED ]
        </div>
        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${progressPercent}%`
          }} />
        </div>
      </div>
    </div>
  );
}

export default DailyCheck;