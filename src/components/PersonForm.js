import React, { useState } from 'react';

function PersonForm({ onAddPerson, people }) {
  const [peopleList, setPeopleList] = useState([{ name: '', surname: '', relationship: 'friend', metWhen: '', why: '' }]);
  const [commonMetWhen, setCommonMetWhen] = useState('');
  const [commonWhy, setCommonWhy] = useState('');
  const [useCommonData, setUseCommonData] = useState(true);

  const handleAddPerson = () => {
    setPeopleList([...peopleList, { name: '', surname: '', relationship: 'friend', metWhen: '', why: '' }]);
  };

  const handleRemovePerson = (index) => {
    if (peopleList.length > 1) {
      const newList = peopleList.filter((_, i) => i !== index);
      setPeopleList(newList);
    }
  };

  const handlePersonChange = (index, field, value) => {
    const newList = [...peopleList];
    newList[index][field] = value;
    setPeopleList(newList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validPeople = peopleList.filter(person => person.name.trim() && person.surname.trim());
    
    if (validPeople.length === 0) {
      alert('Inserisci almeno una persona con nome e cognome');
      return;
    }
    
    validPeople.forEach(person => {
      const personData = {
        name: person.name.trim(),
        surname: person.surname.trim(),
        relationship: person.relationship,
        metWhen: useCommonData ? commonMetWhen.trim() : person.metWhen.trim(),
        why: useCommonData ? commonWhy.trim() : person.why.trim(),
      };
      
      onAddPerson(personData);
    });
    
    setPeopleList([{ name: '', surname: '', relationship: 'friend', metWhen: '', why: '' }]);
    setCommonMetWhen('');
    setCommonWhy('');
    setUseCommonData(true);
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
      marginBottom: '10px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#0a0a0a',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
      minHeight: '50px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
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
      marginBottom: '10px',
    },
    addPersonButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'transparent',
      color: '#00ccff',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontFamily: "'Courier New', monospace",
      marginBottom: '15px',
    },
    removeButton: {
      padding: '5px 10px',
      backgroundColor: 'transparent',
      color: '#ff4444',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace',
      transition: 'all 0.3s',
      marginBottom: '10px',
    },
    personCard: {
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '15px',
      position: 'relative',
    },
    personTitle: {
      color: '#00ff00',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '10px',
      letterSpacing: '1px',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '15px',
      cursor: 'pointer',
    },
    checkbox: {
      accentColor: '#00ff00',
      cursor: 'pointer',
      width: '18px',
      height: '18px',
    },
    checkboxLabel: {
      color: '#00ff00',
      fontSize: '12px',
      letterSpacing: '1px',
    },
    commonSection: {
      backgroundColor: 'rgba(0, 204, 255, 0.05)',
      border: '1px solid rgba(0, 204, 255, 0.2)',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '15px',
    },
    commonTitle: {
      color: '#00ccff',
      fontSize: '13px',
      fontWeight: 'bold',
      marginBottom: '10px',
      letterSpacing: '1px',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{marginBottom: '15px', color: '#00ff00', letterSpacing: '2px', fontSize: '16px'}}>
        [ AGGIUNGI PERSONE ]
      </h2>
      
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={useCommonData}
          onChange={(e) => setUseCommonData(e.target.checked)}
          style={styles.checkbox}
        />
        <span style={styles.checkboxLabel}>
          Stessa data e motivazione per tutte le persone
        </span>
      </div>
      
      {useCommonData && (
        <div style={styles.commonSection}>
          <div style={styles.commonTitle}>[ DATI COMUNI ]</div>
          
          <label style={styles.label}>Quando li ho conosciuti:</label>
          <input
            type="text"
            value={commonMetWhen}
            onChange={(e) => setCommonMetWhen(e.target.value)}
            placeholder="Es. 2020, Scuola, ecc..."
            style={styles.input}
          />
          
          <label style={styles.label}>Perché li ho conosciuti:</label>
          <textarea
            value={commonWhy}
            onChange={(e) => setCommonWhy(e.target.value)}
            placeholder="Motivo della conoscenza..."
            style={styles.textarea}
          />
        </div>
      )}
      
      {peopleList.map((person, index) => (
        <div key={index} style={styles.personCard}>
          <div style={styles.personTitle}>
            [ PERSONA {index + 1} ]
            {peopleList.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePerson(index)}
                style={{
                  ...styles.removeButton,
                  float: 'right',
                  marginBottom: '0',
                }}
              >
                [RIMUOVI]
              </button>
            )}
          </div>
          
          <label style={styles.label}>Nome:</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
            placeholder="Nome..."
            style={styles.input}
            required
          />
          
          <label style={styles.label}>Cognome:</label>
          <input
            type="text"
            value={person.surname}
            onChange={(e) => handlePersonChange(index, 'surname', e.target.value)}
            placeholder="Cognome..."
            style={styles.input}
            required
          />
          
          <label style={styles.label}>Grado di amicizia:</label>
          <select
            value={person.relationship}
            onChange={(e) => handlePersonChange(index, 'relationship', e.target.value)}
            style={styles.select}
          >
            <option value="close_friend">Amico Stretto</option>
            <option value="important_friend">Amico Importante</option>
            <option value="friend">Amico</option>
            <option value="acquaintance">Conoscente</option>
            <option value="enemy">Nemico</option>
          </select>
          
          {!useCommonData && (
            <>
              <label style={styles.label}>Quando l'ho conosciuto:</label>
              <input
                type="text"
                value={person.metWhen}
                onChange={(e) => handlePersonChange(index, 'metWhen', e.target.value)}
                placeholder="Es. 2020, Scuola, ecc..."
                style={styles.input}
              />
              
              <label style={styles.label}>Perché l'ho conosciuto:</label>
              <textarea
                value={person.why}
                onChange={(e) => handlePersonChange(index, 'why', e.target.value)}
                placeholder="Motivo della conoscenza..."
                style={styles.textarea}
              />
            </>
          )}
        </div>
      ))}
      
      <button 
        type="button"
        style={styles.addPersonButton}
        onClick={handleAddPerson}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 204, 255, 0.1)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        [ + AGGIUNGI ALTRA PERSONA ]
      </button>
      
      <button 
        type="submit" 
        style={styles.button}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        [ SALVA {peopleList.filter(p => p.name.trim() && p.surname.trim()).length} PERSONE ]
      </button>
    </form>
  );
}

export default PersonForm;