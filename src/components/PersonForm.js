import React, { useState } from 'react';

function PersonForm({ onAddPerson, people, onAddConnection }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [relationship, setRelationship] = useState('friend');
  const [metWhen, setMetWhen] = useState('');
  const [why, setWhy] = useState('');
  const [connectedTo, setConnectedTo] = useState('');
  const [connectionType, setConnectionType] = useState('friend');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (name.trim() && surname.trim()) {
      const personData = {
        name: name.trim(),
        surname: surname.trim(),
        relationship,
        metWhen: metWhen.trim(),
        why: why.trim(),
      };
      
      onAddPerson(personData);
      
      // Se è selezionata una connessione, crea il collegamento
      if (connectedTo) {
        // La connessione verrà creata dopo che la persona è stata aggiunta
        // Per ora, salviamo i dati della connessione
        console.log('Connessione da creare:', {
          from: 'me',
          to: connectedTo,
          type: connectionType
        });
      }
      
      setName('');
      setSurname('');
      setRelationship('friend');
      setMetWhen('');
      setWhy('');
      setConnectedTo('');
      setConnectionType('friend');
    }
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
      boxSizing: 'border-box',
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
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{marginBottom: '15px', color: '#00ff00', letterSpacing: '2px', fontSize: '16px'}}>
        [ AGGIUNGI PERSONA ]
      </h2>
      
      <label style={styles.label}>Nome:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome..."
        style={styles.input}
        required
      />
      
      <label style={styles.label}>Cognome:</label>
      <input
        type="text"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        placeholder="Cognome..."
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
        <option value="friend">Amico</option>
        <option value="acquaintance">Conoscente</option>
        <option value="enemy">Nemico</option>
      </select>
      
      <label style={styles.label}>Quando l'ho conosciuto:</label>
      <input
        type="text"
        value={metWhen}
        onChange={(e) => setMetWhen(e.target.value)}
        placeholder="Es. 2020, Scuola, ecc..."
        style={styles.input}
      />
      
      <label style={styles.label}>Perché l'ho conosciuto:</label>
      <textarea
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        placeholder="Motivo della conoscenza..."
        style={styles.textarea}
      />
      
      <label style={styles.label}>Collegamento con altra persona (opzionale):</label>
      <select
        value={connectedTo}
        onChange={(e) => setConnectedTo(e.target.value)}
        style={styles.select}
      >
        <option value="">Nessun collegamento</option>
        <option value="me">Me</option>
        {people.map(person => (
          <option key={person.id} value={person.id}>
            {person.name} {person.surname}
          </option>
        ))}
      </select>
      
      {connectedTo && (
        <>
          <label style={styles.label}>Tipo di collegamento:</label>
          <select
            value={connectionType}
            onChange={(e) => setConnectionType(e.target.value)}
            style={styles.select}
          >
            <option value="close_friend">Amico Stretto</option>
            <option value="friend">Amico</option>
            <option value="acquaintance">Conoscente</option>
            <option value="enemy">Nemico</option>
          </select>
        </>
      )}
      
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
        [ SALVA PERSONA ]
      </button>
    </form>
  );
}

export default PersonForm;