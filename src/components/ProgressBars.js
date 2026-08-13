import React, { useState } from 'react';

function ProgressBars({ goals, onDeleteGoal }) {
  const [expandedGoal, setExpandedGoal] = useState(null);

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

  const toggleExpand = (goalId) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };

  const styles = {
    container: {
      display: 'grid',
      gap: '8px',
      fontFamily: "'Courier New', monospace",
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    },
    goalCard: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    goalCardExpanded: {
      backgroundColor: 'rgba(0, 255, 0, 0.04)',
      padding: '15px',
      borderRadius: '4px',
      border: '1px solid #00ff00',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    goalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      gap: '8px',
      width: '100%',
      boxSizing: 'border-box',
      flexWrap: 'wrap',
    },
    goalName: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#00ff00',
      letterSpacing: '1px',
      flex: 1,
      marginRight: '10px',
      minWidth: 0,
      wordBreak: 'break-word',
    },
    goalDescription: {
      fontSize: '11px',
      color: '#00cc00',
      marginBottom: '8px',
      opacity: '0.8',
      letterSpacing: '0.5px',
      padding: '8px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      width: '100%',
      boxSizing: 'border-box',
      wordBreak: 'break-word',
    },
    colorDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '8px',
      verticalAlign: 'middle',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      flexShrink: 0,
    },
    deleteButton: {
      backgroundColor: 'transparent',
      color: '#ff4444',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer',
      fontSize: '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
      flexShrink: 0,
    },
    progressBarContainer: {
      width: '100%',
      height: '20px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '2px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      boxSizing: 'border-box',
    },
    progressBar: {
      height: '100%',
      borderRadius: '2px',
      transition: 'width 0.5s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '10px',
      letterSpacing: '1px',
      minWidth: '0px',
      maxWidth: '100%',
    },
    info: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#00cc00',
      fontSize: '11px',
      flexWrap: 'wrap',
      gap: '10px',
      letterSpacing: '1px',
      marginTop: '5px',
      width: '100%',
      boxSizing: 'border-box',
      wordBreak: 'break-word',
    },
    expandedContent: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    historyContainer: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    historyTitle: {
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#00ff00',
      marginBottom: '8px',
      letterSpacing: '1px',
    },
    daysGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      width: '100%',
      boxSizing: 'border-box',
    },
    dayBox: {
      width: '16px',
      height: '16px',
      borderRadius: '2px',
      border: '1px solid #00ff00',
      transition: 'all 0.3s',
      flexShrink: 0,
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#00ff00',
      padding: '40px 20px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid #00ff00',
      letterSpacing: '2px',
      width: '100%',
      boxSizing: 'border-box',
    },
    expandIndicator: {
      color: '#00ff00',
      fontSize: '10px',
      marginLeft: '5px',
    },
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
        const isExpanded = expandedGoal === goalId;
        const goalColor = goal.color || '#00ff00';
        
        return (
          <div 
            key={goalId || Math.random()} 
            style={isExpanded ? styles.goalCardExpanded : styles.goalCard}
            onClick={() => toggleExpand(goalId)}
          >
            <div style={styles.goalHeader}>
              <div style={{display: 'flex', alignItems: 'center', flex: 1, minWidth: 0}}>
                <span 
                  style={{
                    ...styles.colorDot,
                    backgroundColor: goalColor,
                    boxShadow: `0 0 5px ${goalColor}`,
                  }}
                />
                <span style={styles.goalName}>
                  {goal.name || 'UNTITLED'}
                  <span style={styles.expandIndicator}>
                    {isExpanded ? ' [-]' : ' [+]'}
                  </span>
                </span>
              </div>
              <button 
                style={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGoal(goalId);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
                  e.target.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.boxShadow = 'none';
                }}
              >
                [DEL]
              </button>
            </div>

            {isExpanded && goal.description && (
              <div style={styles.goalDescription}>
                {goal.description}
              </div>
            )}
            
            <div style={styles.progressBarContainer}>
              <div style={{
                ...styles.progressBar,
                width: `${progress}%`,
                background: progress > 0 
                  ? `linear-gradient(90deg, ${goalColor}33, ${goalColor})`
                  : 'transparent',
              }}>
                {progress > 0 && `${Math.round(progress)}%`}
              </div>
            </div>

            <div style={styles.info}>
              <span>{Math.round(progress)}%</span>
              <span>{dailyHistory.length}/{duration}d</span>
            </div>

            {isExpanded && (
              <div style={styles.expandedContent}>
                <div style={styles.info}>
                  <span>START: {formatDate(goal.startDate)}</span>
                  <span>FREQ: {getFrequencyLabel(goal)}</span>
                  <span>LEFT: {daysRemaining}d</span>
                </div>

                <div style={styles.historyContainer}>
                  <div style={styles.historyTitle}>
                    COMPLETION HISTORY
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
                            backgroundColor: isCompleted ? goalColor : 'transparent',
                            boxShadow: isCompleted ? `0 0 5px ${goalColor}` : 'none',
                          }}
                          title={`Day ${index + 1}: ${isCompleted ? 'COMPLETED' : 'PENDING'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBars;