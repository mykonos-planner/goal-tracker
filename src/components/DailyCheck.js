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
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      marginBottom: '30px',
    },
    header: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '1.3em',
    },
    goalItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      marginBottom: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    checkbox: {
      width: '24px',
      height: '24px',
      marginRight: '15px',
      cursor: 'pointer',
    },
    goalName: {
      fontSize: '16px',
      color: '#333',
      flex: 1,
    },
    goalInfo: {
      fontSize: '12px',
      color: '#666',
      marginLeft: '10px',
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#999',
      padding: '20px',
    },
    completedToday: {
      backgroundColor: '#e8f5e9',
    },
    notCompletedToday: {
      backgroundColor: '#f5f5f5',
    }
  };

  // Controllo se goals è un array valido
  if (!Array.isArray(goals) || goals.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.emptyMessage}>
          Nessun obiettivo da monitorare. Aggiungi un nuovo obiettivo!
        </p>
      </div>
    );
  }

  const isCompletedToday = (goal) => {
    return goal.checkedToday === true || 
           (Array.isArray(goal.dailyHistory) && goal.dailyHistory.includes(todayString));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📅 Check Giornaliero - {todayFormatted}</h2>
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
              if (!completed) e.target.style.backgroundColor = '#e3f2fd';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = completed ? '#e8f5e9' : '#f5f5f5';
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
              {goal.name || 'Obiettivo senza nome'}
            </span>
            <span style={styles.goalInfo}>
              {completed 
                ? '✓ Completato oggi' 
                : `Da fare (${dailyHistory.length}/${goal.duration || 0} giorni completati)`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DailyCheck;