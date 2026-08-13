import React, { useState } from 'react';

function CalendarView({ goals }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const shouldDoGoalOnDate = (goal, date) => {
    const goalStartDate = new Date(goal.startDate);
    const daysSinceStart = Math.floor((date - goalStartDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart < 0 || daysSinceStart >= goal.duration) {
      return false;
    }
    
    switch (goal.frequency) {
      case 'daily':
        return true;
      case 'alternate':
        return daysSinceStart % 2 === 0;
      case 'weekly':
        const dayOfWeek = date.getDay();
        return goal.frequencyDays && goal.frequencyDays.includes(dayOfWeek);
      default:
        return true;
    }
  };

  const getGoalsForDate = (date) => {
    return goals.filter(goal => shouldDoGoalOnDate(goal, date));
  };

  const isDateCompleted = (date, goalId) => {
    const goal = goals.find(g => g.id === goalId || g._id === goalId);
    if (!goal) return false;
    
    const dateString = date.toDateString();
    return goal.dailyHistory && goal.dailyHistory.includes(dateString);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const changeMonth = (increment) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const styles = {
    container: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      borderRadius: '4px',
      padding: isMobile ? '10px' : '15px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      fontFamily: "'Courier New', monospace",
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      gap: '10px',
    },
    monthTitle: {
      fontSize: isMobile ? '0.9em' : '1em',
      color: '#00ff00',
      letterSpacing: '1px',
      fontWeight: 'normal',
      textAlign: 'center',
      flex: 1,
    },
    navButton: {
      padding: isMobile ? '8px 12px' : '6px 10px',
      backgroundColor: 'transparent',
      color: '#00ff00',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s',
      fontFamily: "'Courier New', monospace",
      flexShrink: 0,
      minWidth: isMobile ? '40px' : 'auto',
      minHeight: isMobile ? '40px' : 'auto',
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: isMobile ? '4px' : '2px',
      marginBottom: isMobile ? '8px' : '5px',
    },
    weekDay: {
      textAlign: 'center',
      color: '#00cc00',
      padding: isMobile ? '8px 0' : '5px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '4px',
      fontSize: isMobile ? '9px' : '8px',
      letterSpacing: '0.5px',
      fontWeight: 'bold',
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: isMobile ? '4px' : '2px',
    },
    dayCell: {
      minHeight: isMobile ? '50px' : '70px',
      padding: isMobile ? '6px' : '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      overflow: 'hidden',
    },
    dayCellToday: {
      minHeight: isMobile ? '50px' : '70px',
      padding: isMobile ? '6px' : '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '1px solid #00ff00',
      overflow: 'hidden',
    },
    dayCellSelected: {
      minHeight: isMobile ? '50px' : '70px',
      padding: isMobile ? '6px' : '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '1px solid #00ff00',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
      overflow: 'hidden',
    },
    dayNumber: {
      color: '#00ff00',
      marginBottom: isMobile ? '3px' : '3px',
      fontSize: isMobile ? '11px' : '10px',
      fontWeight: 'bold',
      textAlign: isMobile ? 'center' : 'left',
    },
    goalsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '2px' : '1px',
      alignItems: isMobile ? 'center' : 'stretch',
    },
    goalDot: {
      width: isMobile ? '8px' : '6px',
      height: isMobile ? '8px' : '6px',
      borderRadius: '50%',
      transition: 'all 0.3s',
      flexShrink: 0,
    },
    goalBadge: {
      padding: '1px 3px',
      borderRadius: '2px',
      fontSize: '7px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      letterSpacing: '0.3px',
      color: '#ffffff',
      display: 'block',
    },
    goalBadgeCompleted: {
      padding: '1px 3px',
      borderRadius: '2px',
      fontSize: '7px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      letterSpacing: '0.3px',
      color: '#ffffff',
      textDecoration: 'line-through',
      display: 'block',
    },
    detailsPanel: {
      marginTop: '15px',
      padding: isMobile ? '12px' : '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
    },
    detailsTitle: {
      color: '#00ff00',
      marginBottom: '10px',
      fontSize: isMobile ? '11px' : '12px',
      letterSpacing: '1px',
    },
    goalItem: {
      padding: isMobile ? '10px' : '8px',
      marginBottom: '5px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      gap: '10px',
      minHeight: isMobile ? '40px' : 'auto',
    },
    completedIcon: {
      color: '#00ff00',
      fontWeight: 'bold',
      fontSize: isMobile ? '9px' : '10px',
      flexShrink: 0,
    },
    pendingIcon: {
      color: '#ff9900',
      fontWeight: 'bold',
      fontSize: isMobile ? '9px' : '10px',
      flexShrink: 0,
    },
    colorDot: {
      width: isMobile ? '10px' : '8px',
      height: isMobile ? '10px' : '8px',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '5px',
      verticalAlign: 'middle',
      flexShrink: 0,
    },
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.navButton} 
          onClick={() => changeMonth(-1)}
        >
          ←
        </button>
        <h2 style={styles.monthTitle}>
          {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }).toUpperCase()}
        </h2>
        <button 
          style={styles.navButton} 
          onClick={() => changeMonth(1)}
        >
          →
        </button>
      </div>

      <div style={styles.weekDays}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div style={styles.daysGrid}>
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const goalsForDate = getGoalsForDate(date);
          const today = isToday(date);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              style={isSelected ? styles.dayCellSelected : today ? styles.dayCellToday : styles.dayCell}
              onClick={() => setSelectedDate(date)}
            >
              <div style={styles.dayNumber}>{date.getDate()}</div>
              <div style={styles.goalsContainer}>
                {goalsForDate.slice(0, isMobile ? 3 : 4).map(goal => {
                  const goalId = goal.id || goal._id;
                  const completed = isDateCompleted(date, goalId);
                  const goalColor = goal.color || '#00ff00';
                  
                  if (isMobile) {
                    // Mobile: mostra pallini colorati
                    return (
                      <span
                        key={goalId}
                        style={{
                          ...styles.goalDot,
                          backgroundColor: completed ? goalColor : `${goalColor}66`,
                          border: `1px solid ${goalColor}`,
                          boxShadow: completed ? `0 0 4px ${goalColor}` : 'none',
                        }}
                        title={`${goal.name} - ${completed ? 'COMPLETED' : 'PENDING'}`}
                      />
                    );
                  } else {
                    // Desktop: mostra badge con nome
                    return (
                      <span
                        key={goalId}
                        style={{
                          ...(completed ? styles.goalBadgeCompleted : styles.goalBadge),
                          backgroundColor: completed ? goalColor : `${goalColor}66`,
                          border: `1px solid ${goalColor}`,
                        }}
                        title={`${goal.name} - ${completed ? 'COMPLETED' : 'PENDING'}`}
                      >
                        {completed ? '✓ ' : '• '}{goal.name.substring(0, 10)}
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={styles.detailsPanel}>
          <h3 style={styles.detailsTitle}>
            [ {selectedDate.toLocaleDateString('it-IT', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            }).toUpperCase()} ]
          </h3>
          {getGoalsForDate(selectedDate).length === 0 ? (
            <p style={{color: '#00cc00', fontSize: '11px'}}>No tasks scheduled</p>
          ) : (
            getGoalsForDate(selectedDate).map(goal => {
              const goalId = goal.id || goal._id;
              const completed = isDateCompleted(selectedDate, goalId);
              const goalColor = goal.color || '#00ff00';
              
              return (
                <div key={goalId} style={styles.goalItem}>
                  <span style={{color: '#00ff00', fontSize: '11px', flex: 1, display: 'flex', alignItems: 'center'}}>
                    <span style={{
                      ...styles.colorDot,
                      backgroundColor: goalColor,
                      boxShadow: `0 0 3px ${goalColor}`,
                    }} />
                    {goal.name}
                  </span>
                  <span style={completed ? styles.completedIcon : styles.pendingIcon}>
                    {completed ? '[DONE]' : '[PEND]'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarView;