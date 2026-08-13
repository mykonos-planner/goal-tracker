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
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return false;
    
    const dateString = date.toDateString();
    return goal.dailyHistory && goal.dailyHistory.includes(dateString);
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
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    monthTitle: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      color: '#333',
    },
    navButton: {
      padding: '8px 16px',
      backgroundColor: '#9C27B0',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '5px',
      marginBottom: '10px',
    },
    weekDay: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#666',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '5px',
    },
    dayCell: {
      minHeight: '80px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
    },
    dayCellToday: {
      minHeight: '80px',
      padding: '10px',
      backgroundColor: '#e3f2fd',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '2px solid #2196F3',
    },
    dayCellSelected: {
      minHeight: '80px',
      padding: '10px',
      backgroundColor: '#f3e5f5',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      border: '2px solid #9C27B0',
    },
    dayNumber: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px',
    },
    goalBadge: {
      display: 'inline-block',
      padding: '2px 6px',
      margin: '2px',
      borderRadius: '10px',
      fontSize: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      cursor: 'pointer',
    },
    goalBadgeCompleted: {
      display: 'inline-block',
      padding: '2px 6px',
      margin: '2px',
      borderRadius: '10px',
      fontSize: '10px',
      backgroundColor: '#8BC34A',
      color: 'white',
      cursor: 'pointer',
      textDecoration: 'line-through',
    },
    goalBadgeMissed: {
      display: 'inline-block',
      padding: '2px 6px',
      margin: '2px',
      borderRadius: '10px',
      fontSize: '10px',
      backgroundColor: '#ff9800',
      color: 'white',
      cursor: 'pointer',
    },
    detailsPanel: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
    },
    detailsTitle: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    goalItem: {
      padding: '10px',
      marginBottom: '5px',
      backgroundColor: 'white',
      borderRadius: '6px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const today = new Date();

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
        <button style={styles.navButton} onClick={() => changeMonth(-1)}>
          ←
        </button>
        <h2 style={styles.monthTitle}>
          {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
        </h2>
        <button style={styles.navButton} onClick={() => changeMonth(1)}>
          →
        </button>
      </div>

      <div style={styles.weekDays}>
        {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div style={styles.daysGrid}>
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const goalsForDate = getGoalsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              style={isSelected ? styles.dayCellSelected : isToday ? styles.dayCellToday : styles.dayCell}
              onClick={() => setSelectedDate(date)}
            >
              <div style={styles.dayNumber}>{date.getDate()}</div>
              {goalsForDate.map(goal => {
                const completed = isDateCompleted(date, goal.id);
                return (
                  <span
                    key={goal.id}
                    style={completed ? styles.goalBadgeCompleted : styles.goalBadge}
                    title={goal.name}
                  >
                    {goal.name.substring(0, 10)}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={styles.detailsPanel}>
          <h3 style={styles.detailsTitle}>
            Obiettivi per il {selectedDate.toLocaleDateString('it-IT', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </h3>
          {getGoalsForDate(selectedDate).length === 0 ? (
            <p>Nessun obiettivo programmato per questo giorno</p>
          ) : (
            getGoalsForDate(selectedDate).map(goal => {
              const completed = isDateCompleted(selectedDate, goal.id);
              return (
                <div key={goal.id} style={styles.goalItem}>
                  <span>{goal.name}</span>
                  <span style={{ 
                    color: completed ? '#4CAF50' : '#666',
                    fontWeight: 'bold'
                  }}>
                    {completed ? '✓ Completato' : 'Da fare'}
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