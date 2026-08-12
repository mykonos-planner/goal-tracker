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

  if (goals.length === 0) {
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
      {goals.map(goal => (
        <div
          key={goal.id}
          style={{
            ...styles.goalItem,
            backgroundColor: goal.checkedToday ? '#e8f5e9' : '#f5f5f5'
          }}
          onClick={() => onToggleCheck(goal.id)}
          onMouseEnter={(e) => {
            if (!goal.checkedToday) e.target.style.backgroundColor = '#e3f2fd';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = goal.checkedToday ? '#e8f5e9' : '#f5f5f5';
          }}
        >
          <input
            type="checkbox"
            checked={goal.checkedToday}
            onChange={() => onToggleCheck(goal.id)}
            style={styles.checkbox}
            onClick={(e) => e.stopPropagation()}
          />
          <span style={styles.goalName}>{goal.name}</span>
          <span style={{ color: goal.checkedToday ? '#4CAF50' : '#999' }}>
            {goal.checkedToday ? '✓ Completato' : 'Da fare'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default DailyCheck;