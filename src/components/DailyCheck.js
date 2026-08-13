import React from 'react';

function DailyCheck({ goals, onToggleCheck }) {
  const today = new Date().toLocaleDateString('it-IT', {
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
    emptyMessage: {
      textAlign: 'center',
      color: '#999',
      padding: '20px',
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

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📅 Check Giornaliero - {today}</h2>
      {goals.map(goal => {
        // Controllo che goal esista
        if (!goal || (!goal.id && !goal._id)) {
          return null;
        }
        
        const goalId = goal.id || goal._id;
        const isChecked = goal.checkedToday || false;
        
        return (
          <div
            key={goalId}
            style={{
              ...styles.goalItem,
              backgroundColor: isChecked ? '#e8f5e9' : '#f5f5f5'
            }}
            onClick={() => onToggleCheck(goalId, !isChecked)}
            onMouseEnter={(e) => {
              if (!isChecked) e.target.style.backgroundColor = '#e3f2fd';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isChecked ? '#e8f5e9' : '#f5f5f5';
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggleCheck(goalId, !isChecked)}
              style={styles.checkbox}
              onClick={(e) => e.stopPropagation()}
            />
            <span style={styles.goalName}>{goal.name || 'Obiettivo senza nome'}</span>
            <span style={{ color: isChecked ? '#4CAF50' : '#999' }}>
              {isChecked ? '✓ Completato' : 'Da fare'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DailyCheck;