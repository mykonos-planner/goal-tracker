import React, { useState } from 'react';

function GroupForm({ onAddGroup, people }) {
  const [groupName, setGroupName] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [includeMe, setIncludeMe] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      setSearchTerm('');
    }
  };

  const togglePerson = (personId) => {
    setSelectedPeople(prev => 
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const filteredPeople = people.filter(person => {
    const fullName = (person.name + ' ' + person.surname).toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

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
    searchInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#ff9900',
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
    searchLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#ff9900',
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
      maxHeight: '300px',
      overflowY: 'auto',
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
    personCheckboxSelected: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      cursor: 'pointer',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      marginBottom: '5px',
      transition: 'all 0.3s',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
    },
    checkbox: {
      accentColor: '#00ff00',
      cursor: 'pointer',
      flexShrink: 0,
    },
    personLabel: {
      color: '#00ff00',
      fontSize: '13px',
    },
    selectedCount: {
      color: '#00ccff',
      fontSize: '11px',
      marginBottom: '10px',
      letterSpacing: '1px',
    },
    noResults: {
      color: '#666',
      fontSize: '12px',
      textAlign: 'center',
      padding: '10px',
      letterSpacing: '1px',
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
        <label style={styles.searchLabel}>Cerca persone:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca per nome o cognome..."
          style={styles.searchInput}
        />
        
        <div style={styles.selectedCount}>
          [ SELEZIONATI: {selectedPeople.length + (includeMe ? 1 : 0)} ]
        </div>
        
        <div 
          style={includeMe ? styles.personCheckboxSelected : styles.personCheckbox}
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
        
        {filteredPeople.length === 0 ? (
          <div style={styles.noResults}>
            [ NESSUN RISULTATO ]
          </div>
        ) : (
          filteredPeople.map(person => (
            <div 
              key={person.id}
              style={selectedPeople.includes(person.id) ? styles.personCheckboxSelected : styles.personCheckbox}
              onClick={() => togglePerson(person.id)}
              onMouseEnter={(e) => {
                if (!selectedPeople.includes(person.id)) {
                  e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedPeople.includes(person.id)) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
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
          ))
        )}
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