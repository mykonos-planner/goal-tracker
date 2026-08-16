import React, { useState } from 'react';

function EditGroupForm({ group, people, onUpdateGroup, onCancel }) {
  const [groupName, setGroupName] = useState(group.name || '');
  const [selectedPeople, setSelectedPeople] = useState(group.people || []);
  const [includeMe, setIncludeMe] = useState(group.includeMe || false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (groupName.trim() && selectedPeople.length > 0) {
      onUpdateGroup(group.id, {
        name: groupName.trim(),
        people: selectedPeople,
        includeMe,
      });
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
      backgroundColor: 'rgba(0, 204, 255, 0.05)',
      padding: '20px',
      borderRadius: '4px',
      border: '1px solid #00ccff',
      marginBottom: '20px',
      fontFamily: "'Courier New', monospace",
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#00ccff',
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
      color: '#00ccff',
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
    buttonContainer: {
      display: 'flex',
      gap: '10px',
    },
    saveButton: {
      flex: 1,
      padding: '12px',
      backgroundColor: 'transparent',
      color: '#00ccff',
      border: '1px solid #00ccff',
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
      border: '1px solid rgba(0, 204, 255, 0.2)',
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
      border: '1px solid #00ccff',
      borderRadius: '4px',
      marginBottom: '5px',
      transition: 'all 0.3s',
      backgroundColor: 'rgba(0, 204, 255, 0.05)',
    },
    checkbox: {
      accentColor: '#00ccff',
      cursor: 'pointer',
      flexShrink: 0,
    },
    personLabel: {
      color: '#00ccff',
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
      <h2 style={{marginBottom: '15px', color: '#00ccff', letterSpacing: '2px', fontSize: '16px'}}>
        [ EDIT GROUP ]
      </h2>
      
      <label style={styles.label}>Nome gruppo:</label>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
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
      
      <div style={styles.buttonContainer}>
        <button 
          type="submit" 
          style={styles.saveButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 204, 255, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          [ SAVE ]
        </button>
        <button 
          type="button"
          style={styles.cancelButton}
          onClick={onCancel}
        >
          [ CANCEL ]
        </button>
      </div>
    </form>
  );
}

export default EditGroupForm;