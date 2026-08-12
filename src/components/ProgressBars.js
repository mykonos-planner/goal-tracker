import React from 'react';

function ProgressBars({ goals, onDeleteGoal }) {
  const getProgress = (goal) => {
    const daysCompleted = goal.dailyHistory.length;
    const progressPercent = Math.min((daysCompleted / goal.duration) * 100, 100);
    return progressPercent;
  };

  const getDaysRemaining = (goal) => {
    const daysCompleted = goal.dailyHistory.length;
    return Math.max(goal.duration - daysCompleted, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const styles = {
    container: {
      display: 'grid',
      gap: '20px',
    },
    goalCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    goalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    goalName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    deleteButton: {
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    progressBarContainer: {
      width: '100%',
      height: '30px',
      backgroundColor: '#e0e0e0',
      borderRadius: '15px',
      overflow: 'hidden',
      marginBottom: '10px',
      position: 'relative',
    },
    progressBar: {
      height: '100%',
      background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
      borderRadius: '15px',
      transition: 'width 0.5s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
      minWidth: '50px',
    },
    info: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#666',
      fontSize: '14px',
    },
    historyContainer: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
    },
    historyTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
    },
    daysGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px',
    },
    dayBox: {
      width: '20px',
      height: '20px',
      borderRadius: '3px',
      border: '1px solid #ddd',
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#999',
      padding: '40px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
    }
  };

  if (goals.length === 0) {
    return (
      <div style={styles.emptyMessage}>
        <h3>🎯 Nessun obiettivo ancora</h3>
        <p>Clicca su "Nuovo Obiettivo" per iniziare!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {goals.map(goal => {
        const progress = getProgress(goal);
        const daysRemaining = getDaysRemaining(goal);
        
        return (
          <div key={goal.id} style={styles.goalCard}>
            <div style={styles.goalHeader}>
              <div style={styles.goalName}>{goal.name}</div>
              <button 
                style={styles.deleteButton}
                onClick={() => onDeleteGoal(goal.id)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#cc0000'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4444'}
              >
                Elimina
              </button>
            </div>
            
            <div style={styles.progressBarContainer}>
              <div style={{
                ...styles.progressBar,
                width: `${progress}%`
              }}>
                {Math.round(progress)}%
              </div>
            </div>
            
            <div style={styles.info}>
              <span>Iniziato: {formatDate(goal.startDate)}</span>
              <span>Durata: {goal.duration} giorni</span>
              <span>Rimanenti: {daysRemaining} giorni</span>
            </div>

            <div style={styles.historyContainer}>
              <div style={styles.historyTitle}>
                Storico completamenti ({goal.dailyHistory.length}/{goal.duration} giorni)
              </div>
              <div style={styles.daysGrid}>
                {Array.from({ length: goal.duration }, (_, index) => {
                  const dayDate = new Date(goal.startDate);
                  dayDate.setDate(dayDate.getDate() + index);
                  const dateString = dayDate.toDateString();
                  const isCompleted = goal.dailyHistory.includes(dateString);
                  
                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.dayBox,
                        backgroundColor: isCompleted ? '#4CAF50' : '#e0e0e0',
                      }}
                      title={`Giorno ${index + 1}: ${isCompleted ? 'Completato' : 'Non completato'}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBars;