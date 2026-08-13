import React, { useState } from 'react';

function GoalForm({ onAddGoal }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [frequency, setFrequency] = useState('daily');
  const [selectedDays, setSelectedDays] = useState([]);

  const weekDays = [
    { value: 0, label: 'Lun' },
    { value: 1, label: 'Mar' },
    { value: 2, label: 'Mer' },
    { value: 3, label: 'Gio' },
    { value: 4, label: 'Ven' },
    { value: 5, label: 'Sab' },
    { value: 6, label: 'Dom' },
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
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      marginBottom: '30px',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'white',
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#333',
      fontWeight: 'bold',
    },
    daysContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '15px',
    },
    dayButton: {
      padding: '10px 15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      backgroundColor: 'white',
      color: '#333',
    },
    dayButtonSelected: {
      padding: '10px 15px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      backgroundColor: '#4CAF50',
      color: 'white',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{marginBottom: '20px', color: '#333'}}>Nuovo Obiettivo</h2>
      
      <label style={styles.label}>Nome obiettivo:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="es. Bere 1 litro d'acqua al giorno"
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Durata (giorni totali):</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        min="1"
        max="365"
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Frequenza:</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        style={styles.select}
      >
        <option value="daily">Ogni giorno</option>
        <option value="alternate">1 giorno sì, 1 giorno no</option>
        <option value="weekly">Giorni specifici della settimana</option>
      </select>
      
      {frequency === 'weekly' && (
        <>
          <label style={styles.label}>Seleziona i giorni:</label>
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
        onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Aggiungi Obiettivo
      </button>
    </form>
  );
}

export default GoalForm;