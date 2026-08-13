import React, { useState } from 'react';

function GoalForm({ onAddGoal }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [durationType, setDurationType] = useState('days');
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState([]);
  const [color, setColor] = useState('#00ff00');
  const [startDateType, setStartDateType] = useState('today');
  const [customStartDate, setCustomStartDate] = useState('');

  const weekDays = [
    { value: 0, label: 'MON' },
    { value: 1, label: 'TUE' },
    { value: 2, label: 'WED' },
    { value: 3, label: 'THU' },
    { value: 4, label: 'FRI' },
    { value: 5, label: 'SAT' },
    { value: 6, label: 'SUN' },
  ];

  const colorOptions = [
    '#00ff00',
    '#00ccff',
    '#ff00ff',
    '#ff9900',
    '#ff4444',
    '#ffff00',
    '#ff69b4',
    '#9b59b6',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && duration > 0) {
      let startDate;
      
      switch (startDateType) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'tomorrow':
          startDate = new Date();
          startDate.setDate(startDate.getDate() + 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'custom':
          startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
      }
      
      console.log('Data inizio selezionata:', startDate);
      
      const goalData = {
        name: name.trim(),
        description: description.trim(),
        duration: parseInt(duration),
        durationType: durationType,
        frequency: frequency,
        frequencyDays: frequency === 'weekly' ? selectedDays : [],
        color: color,
        startDate: startDate.toISOString(),
      };
      
      console.log('Dati obiettivo da salvare:', goalData);
      
      onAddGoal(goalData);
      setName('');
      setDescription('');
      setDuration('30');
      setDurationType('days');
      setFrequency('daily');
      setSelectedDays([]);
      setColor('#00ff00');
      setStartDateType('today');
      setCustomStartDate('');
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
    textarea: {
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
      minHeight: '60px',
      resize: 'vertical',
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
    radioGroup: {
      display: 'flex',
      gap: '15px',
      marginBottom: '15px',
      flexWrap: 'wrap',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
      color: '#00ff00',
      fontSize: '12px',
      letterSpacing: '1px',
    },
    radio: {
      accentColor: '#00ff00',
      cursor: 'pointer',
    },
    colorContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '15px',
    },
    colorButton: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.3s',
    },
    colorButtonSelected: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px solid #ffffff',
      transition: 'all 0.3s',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
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
      
      <label style={styles.label}>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description (optional)..."
        style={styles.textarea}
      />
      
      <label style={styles.label}>Color:</label>
      <div style={styles.colorContainer}>
        {colorOptions.map(colorOption => (
          <button
            key={colorOption}
            type="button"
            onClick={() => setColor(colorOption)}
            style={{
              ...(color === colorOption ? styles.colorButtonSelected : styles.colorButton),
              backgroundColor: colorOption,
            }}
          />
        ))}
      </div>
      
      <label style={styles.label}>Start date:</label>
      <div style={styles.radioGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="today"
            checked={startDateType === 'today'}
            onChange={(e) => setStartDateType(e.target.value)}
            style={styles.radio}
          />
          Today
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="tomorrow"
            checked={startDateType === 'tomorrow'}
            onChange={(e) => setStartDateType(e.target.value)}
            style={styles.radio}
          />
          Tomorrow
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="custom"
            checked={startDateType === 'custom'}
            onChange={(e) => setStartDateType(e.target.value)}
            style={styles.radio}
          />
          Custom date
        </label>
      </div>
      
      {startDateType === 'custom' && (
        <>
          <label style={styles.label}>Select date:</label>
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            style={styles.input}
            required
          />
        </>
      )}
      
      <label style={styles.label}>Duration type:</label>
      <div style={styles.radioGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="days"
            checked={durationType === 'days'}
            onChange={(e) => setDurationType(e.target.value)}
            style={styles.radio}
          />
          Total days
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="period"
            checked={durationType === 'period'}
            onChange={(e) => setDurationType(e.target.value)}
            style={styles.radio}
          />
          Period
        </label>
      </div>
      
      <label style={styles.label}>
        {durationType === 'days' ? 'Number of total days:' : 'Duration period (days):'}
      </label>
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