import React, { useState } from 'react';

function GoalForm({ onAddGoal }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState([]);

  const weekDays = [
    { value: 0, label: 'MON' },
    { value: 1, label: 'TUE' },
    { value: 2, label: 'WED' },
    { value: 3, label: 'THU' },
    { value: 4, label: 'FRI' },
    { value: 5, label: 'SAT' },
    { value: 6, label: 'SUN' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && duration > 0) {
      const goalData = {
        name: name.trim(),
        duration: parseInt(duration),
        frequency: frequency,
        frequencyDays: frequency === 'weekly' ? selectedDays : [],
      };
      
      onAddGoal(goalData);
      setName('');
      setDuration('30');
      setFrequency('daily');
      setSelectedDays([]);
    }
  };

  const toggleDay = (dayValue) => {
    setSelectedDays(prev => 
      prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const styles = {
    form: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      padding: '20px',
      borderRadius: '4px',
      boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
      marginBottom: '30px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      fontFamily: "'Courier New', monospace",
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#0a0a0a',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: 'transparent',
      color: '#00ff00',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: "'Courier New', monospace",
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#00ff00',
      fontWeight: 'bold',
      letterSpacing: '1px',
      fontSize: '11px',
      textTransform: 'uppercase',
    },
    daysContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '15px',
    },
    dayButton: {
      padding: '8px 10px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      backgroundColor: 'transparent',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
    },
    dayButtonSelected: {
      padding: '8px 10px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      backgroundColor: 'rgba(0, 255, 0, 0.2)',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{marginBottom: '15px', color: '#00ff00', letterSpacing: '2px', fontSize: '16px'}}>
        [ NEW TASK ]
      </h2>
      
      <label style={styles.label}>Task name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter task name..."
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Duration (days):</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        min="1"
        max="365"
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Frequency:</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        style={styles.select}
      >
        <option value="daily">Daily</option>
        <option value="alternate">Alternate days</option>
        <option value="weekly">Specific days</option>
      </select>
      
      {frequency === 'weekly' && (
        <>
          <label style={styles.label}>Select days:</label>
          <div style={styles.daysContainer}>
            {weekDays.map(day => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                style={selectedDays.includes(day.value) ? styles.dayButtonSelected : styles.dayButton}
              >
                {day.label}
              </button>
            ))}
          </div>
        </>
      )}
      
      <button 
        type="submit" 
        style={styles.button}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
          e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.boxShadow = 'none';
        }}
      >
        [ ADD TASK ]
      </button>
    </form>
  );
}

export default GoalForm;