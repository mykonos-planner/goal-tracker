import React, { useState } from 'react';

function CalendarView({ goals }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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
      padding: '15px',
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
      fontSize: '1em',
      color: '#00ff00',
      letterSpacing: '1px',
      fontWeight: 'normal',
      textAlign: 'center',
      flex: 1,
    },
    navButton: {
      padding: '6px 10px',
      backgroundColor: 'transparent',
      color: '#00ff00',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s',
      fontFamily: "'Courier New', monospace",
      flexShrink: 0,
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
      marginBottom: '5px',
    },
    weekDay: {
      textAlign: 'center',
      color: '#00cc00',
      padding: '5px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '2px',
      fontSize: '8px',
      letterSpacing: '0.5px',
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
    },
    dayCell: {
      minHeight: '50px',
      padding: '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      borderRadius: '2px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      overflow: 'hidden',
    },
    dayCellToday: {
      minHeight: '50px',
      padding: '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      borderRadius: '2px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '1px solid #00ff00',
      overflow: 'hidden',
    },
    dayCellSelected: {
      minHeight: '50px',
      padding: '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      borderRadius: '2px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '1px solid #00ff00',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
      overflow: 'hidden',
    },
    dayNumber: {
      color: '#00ff00',
      marginBottom: '3px',
      fontSize: '10px',
      fontWeight: 'bold',
    },
    goalsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1px',
    },
    goalBadge: {
      padding: '1px 3px',
      borderRadius: '2px',
      fontSize: '6px',
      backgroundColor: 'rgba(255, 153, 0, 0.2)',
      color: '#ff9900',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      letterSpacing: '0.3px',
    },
    goalBadgeCompleted: {
      padding: '1px 3px',
      borderRadius: '2px',
      fontSize: '6px',
      backgroundColor: 'rgba(0, 255, 0, 0.2)',
      color: '#00ff00',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      letterSpacing: '0.3px',
    },
    detailsPanel: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
    },
    detailsTitle: {
      color: '#00ff00',
      marginBottom: '10px',
      fontSize: '12px',
      letterSpacing: '1px',
    },
    goalItem: {
      padding: '8px',
      marginBottom: '5px',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(0, 255, 0, 0.1)',
      gap: '10px',
    },
    completedIcon: {
      color: '#00ff00',
      fontWeight: 'bold',
      fontSize: '10px',
      flexShrink: 0,
    },
    pendingIcon: {
      color: '#ff9900',
      fontWeight: 'bold',
      fontSize: '10px',
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
                {goalsForDate.slice(0, 3).map(goal => {
                  const goalId = goal.id || goal._id;
                  const completed = isDateCompleted(date, goalId);
                  return (
                    <span
                      key={goalId}
                      style={completed ? styles.goalBadgeCompleted : styles.goalBadge}
                      title={`${goal.name} - ${completed ? 'COMPLETED' : 'PENDING'}`}
                    >
                      {completed ? '✓' : '•'}
                    </span>
                  );
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
              return (
                <div key={goalId} style={styles.goalItem}>
                  <span style={{color: '#00ff00', fontSize: '11px', flex: 1}}>{goal.name}</span>
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