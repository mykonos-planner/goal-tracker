import React, { useState } from 'react';

function GroupForm({ onAddGroup, people }) {
  const [groupName, setGroupName] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [includeMe, setIncludeMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (groupName.trim() && selectedPeople.length > 0) {
      const groupData = {
        name: groupName.trim(),
        people: selectedPeople,
        includeMe,
      };
      
      onAddGroup(groupData);
      setGroupName('');
      setSelectedPeople([]);
      setIncludeMe(false);
    }
  };

  const togglePerson = (personId) => {
    setSelectedPeople(prev => 
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const styles = {
    form: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      padding: '20px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      marginBottom: '20px',
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
      boxSizing: 'border-box',
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
    peopleList: {
      marginBottom: '15px',
    },
    personCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      cursor: 'pointer',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      borderRadius: '4px',
      marginBottom: '5px',
      transition: 'all 0.3s',
    },
    checkbox: {
      accentColor: '#00ff00',
      cursor: 'pointer',
    },
    personLabel: {
      color: '#00ff00',
      fontSize: '13px',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{marginBottom: '15px', color: '#00ff00', letterSpacing: '2px', fontSize: '16px'}}>
        [ CREA GRUPPO ]
      </h2>
      
      <label style={styles.label}>Nome gruppo:</label>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Nome del gruppo..."
        style={styles.input}
        required
      />
      
      <div style={styles.peopleList}>
        <label style={styles.label}>Seleziona persone:</label>
        
        <div 
          style={styles.personCheckbox}
          onClick={() => setIncludeMe(!includeMe)}
        >
          <input
            type="checkbox"
            checked={includeMe}
            onChange={() => setIncludeMe(!includeMe)}
            style={styles.checkbox}
            onClick={(e) => e.stopPropagation()}
          />
          <span style={styles.personLabel}>Me</span>
        </div>
        
        {people.map(person => (
          <div 
            key={person.id}
            style={styles.personCheckbox}
            onClick={() => togglePerson(person.id)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.05)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <input
              type="checkbox"
              checked={selectedPeople.includes(person.id)}
              onChange={() => togglePerson(person.id)}
              style={styles.checkbox}
              onClick={(e) => e.stopPropagation()}
            />
            <span style={styles.personLabel}>{person.name} {person.surname}</span>
          </div>
        ))}
      </div>
      
      <button 
        type="submit" 
        style={styles.button}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        [ CREA GRUPPO ]
      </button>
    </form>
  );
}

export default GroupForm;