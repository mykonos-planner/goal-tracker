import React, { useState } from 'react';

function GoalForm({ onAddGoal }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && duration > 0) {
      onAddGoal({ name: name.trim(), duration: parseInt(duration) });
      setName('');
      setDuration('30');
    }
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
    }
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
      <label style={styles.label}>Durata (giorni):</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        min="1"
        max="365"
        style={styles.input}
        required
      />
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