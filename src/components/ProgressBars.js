import React from 'react';

function ProgressBars({ goals, onDeleteGoal }) {
  const getProgress = (goal) => {
    const daysCompleted = goal.dailyHistory ? goal.dailyHistory.length : 0;
    const progressPercent = Math.min((daysCompleted / goal.duration) * 100, 100);
    return progressPercent;
  };

  const getDaysRemaining = (goal) => {
    const daysCompleted = goal.dailyHistory ? goal.dailyHistory.length : 0;
    return Math.max(goal.duration - daysCompleted, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('it-IT');
    } catch (error) {
      return 'INVALID';
    }
  };

  const getFrequencyLabel = (goal) => {
    switch (goal.frequency) {
      case 'daily':
        return 'DAILY';
      case 'alternate':
        return 'ALTERNATE';
      case 'weekly':
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const selectedDays = (goal.frequencyDays || []).map(d => days[d]);
        return `WEEKLY: ${selectedDays.join(', ')}`;
      default:
        return 'DAILY';
    }
  };

  const styles = {
    container: {
      display: 'grid',
      gap: '20px',
      fontFamily: "'Courier New', monospace",
    },
    goalCard: {
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      padding: '20px',
      borderRadius: '4px',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.05)',
      border: '1px solid #00ff00',
    },
    goalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    goalName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#00ff00',
      letterSpacing: '1px',
    },
    goalFrequency: {
      fontSize: '10px',
      color: '#00cc00',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      padding: '4px 8px',
      borderRadius: '2px',
      display: 'inline-block',
      marginLeft: '10px',
      letterSpacing: '1px',
    },
    deleteButton: {
      backgroundColor: 'transparent',
      color: '#ff4444',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
    },
    progressBarContainer: {
      width: '100%',
      height: '20px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '10px',
      position: 'relative',
      border: '1px solid rgba(0, 255, 0, 0.3)',
    },
    progressBar: {
      height: '100%',
      background: 'linear-gradient(90deg, #003300, #00ff00)',
      borderRadius: '2px',
      transition: 'width 0.5s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '11px',
      minWidth: '50px',
      letterSpacing: '1px',
    },
    info: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#00cc00',
      fontSize: '12px',
      flexWrap: 'wrap',
      gap: '10px',
      letterSpacing: '1px',
    },
    historyContainer: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
    },
    historyTitle: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#00ff00',
      marginBottom: '8px',
      letterSpacing: '1px',
    },
    daysGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
    },
    dayBox: {
      width: '18px',
      height: '18px',
      borderRadius: '2px',
      border: '1px solid #00ff00',
      transition: 'all 0.3s',
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#00ff00',
      padding: '40px 20px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid #00ff00',
      letterSpacing: '2px',
    }
  };

  if (!Array.isArray(goals) || goals.length === 0) {
    return (
      <div style={styles.emptyMessage}>
        <h3>[ NO TASKS ]</h3>
        <p>Click [ NEW TASK ] to initialize</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {goals.map(goal => {
        if (!goal || !goal.id) {
          return null;
        }

        const progress = getProgress(goal);
        const daysRemaining = getDaysRemaining(goal);
        const dailyHistory = goal.dailyHistory || [];
        const duration = goal.duration || 0;
        const goalId = goal.id || goal._id;
        
        return (
          <div key={goalId || Math.random()} style={styles.goalCard}>
            <div style={styles.goalHeader}>
              <div>
                <span style={styles.goalName}>{goal.name || 'UNTITLED'}</span>
                <span style={styles.goalFrequency}>
                  [{getFrequencyLabel(goal)}]
                </span>
              </div>
              <button 
                style={styles.deleteButton}
                onClick={() => onDeleteGoal(goalId)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
                  e.target.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}
              >
                [DELETE]
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
              <span>START: {formatDate(goal.startDate)}</span>
              <span>DURATION: {duration}d</span>
              <span>DONE: {dailyHistory.length}d</span>
              <span>LEFT: {daysRemaining}d</span>
            </div>

            <div style={styles.historyContainer}>
              <div style={styles.historyTitle}>
                COMPLETION HISTORY ({dailyHistory.length}/{duration})
              </div>
              <div style={styles.daysGrid}>
                {Array.from({ length: duration }, (_, index) => {
                  const dayDate = new Date(goal.startDate || new Date());
                  dayDate.setDate(dayDate.getDate() + index);
                  const dateString = dayDate.toDateString();
                  const isCompleted = dailyHistory.includes(dateString);
                  
                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.dayBox,
                        backgroundColor: isCompleted ? '#00ff00' : 'transparent',
                        boxShadow: isCompleted ? '0 0 5px #00ff00' : 'none',
                      }}
                      title={`Day ${index + 1}: ${isCompleted ? 'COMPLETED' : 'PENDING'}`}
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