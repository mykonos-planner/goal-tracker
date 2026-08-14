import React, { useState } from 'react';

function EditPersonForm({ person, onUpdatePerson, onCancel }) {
  const [name, setName] = useState(person.name || '');
  const [surname, setSurname] = useState(person.surname || '');
  const [relationship, setRelationship] = useState(person.relationship || 'friend');
  const [metWhen, setMetWhen] = useState(person.metWhen || '');
  const [why, setWhy] = useState(person.why || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (name.trim() && surname.trim()) {
      onUpdatePerson(person.id, {
        name: name.trim(),
        surname: surname.trim(),
        relationship,
        metWhen: metWhen.trim(),
        why: why.trim(),
      });
    }
  };

  const styles = {
    form: {
      backgroundColor: 'rgba(255, 153, 0, 0.05)',
      padding: '20px',
      borderRadius: '4px',
      border: '1px solid #ff9900',
      marginBottom: '20px',
      fontFamily: "'Courier New', monospace",
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#ff9900',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#0a0a0a',
      color: '#ff9900',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#ff9900',
      fontFamily: "'Courier New', monospace",
      minHeight: '60px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#ff9900',
      fontWeight: 'bold',
      letterSpacing: '1px',
      fontSize: '11px',
      textTransform: 'uppercase',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
    },
    saveButton: {
      flex: 1,
      padding: '12px',
      backgroundColor: 'transparent',
      color: '#ff9900',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: "'Courier New', monospace",
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      backgroundColor: 'transparent',
      color: '#666',
      border: '1px solid #666',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: "'Courier New', monospace",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{marginBottom: '15px', color: '#ff9900', letterSpacing: '2px', fontSize: '16px'}}>
        [ EDIT PERSON ]
      </h2>
      
      <label style={styles.label}>Nome:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Cognome:</label>
      <input
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Grado di amicizia:</label>
      <select
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
        style={styles.select}
      >
        <option value="close_friend">Amico Stretto</option>
        <option value="important_friend">Amico Importante</option>
        <option value="friend">Amico</option>
        <option value="acquaintance">Conoscente</option>
        <option value="enemy">Nemico</option>
      </select>
      
      <label style={styles.label}>Quando l'ho conosciuto:</label>
      <input
        type="text"
        value={metWhen}
        onChange={(e) => setMetWhen(e.target.value)}
        style={styles.input}
      />
      
      <label style={styles.label}>Perché l'ho conosciuto:</label>
      <textarea
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        style={styles.textarea}
      />
      
      <div style={styles.buttonContainer}>
        <button 
          type="submit" 
          style={styles.saveButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 153, 0, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          [ SAVE ]
        </button>
        <button 
          type="button"
          style={styles.cancelButton}
          onClick={onCancel}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 102, 102, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          [ CANCEL ]
        </button>
      </div>
    </form>
  );
}

export default EditPersonForm;