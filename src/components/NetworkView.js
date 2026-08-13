import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import PersonForm from './PersonForm';
import GroupForm from './GroupForm';

function NetworkView() {
  const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState([]);
  const [connections, setConnections] = useState([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'graph'
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      const [peopleRes, groupsRes, connectionsRes] = await Promise.all([
        fetch('/api/network/people'),
        fetch('/api/network/groups'),
        fetch('/api/network/connections')
      ]);
      
      if (peopleRes.ok) setPeople(await peopleRes.json());
      if (groupsRes.ok) setGroups(await groupsRes.json());
      if (connectionsRes.ok) setConnections(await connectionsRes.json());
    } catch (error) {
      console.error('Error fetching network data:', error);
    }
  };

  const addPerson = async (personData) => {
    try {
      const response = await fetch('/api/network/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData)
      });
      
      if (response.ok) {
        const newPerson = await response.json();
        setPeople([...people, newPerson]);
        setShowPersonForm(false);
      }
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const addGroup = async (groupData) => {
    try {
      const response = await fetch('/api/network/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
      
      if (response.ok) {
        const newGroup = await response.json();
        setGroups([...groups, newGroup]);
        setShowGroupForm(false);
      }
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const addConnection = async (connectionData) => {
    try {
      const response = await fetch('/api/network/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionData)
      });
      
      if (response.ok) {
        const newConnection = await response.json();
        setConnections([...connections, newConnection]);
      }
    } catch (error) {
      console.error('Error adding connection:', error);
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    header: {
      color: '#00ff00',
      fontSize: '1.5em',
      marginBottom: '20px',
      letterSpacing: '2px',
      textAlign: 'center',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '10px 20px',
      fontSize: '12px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#00ff00',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
      textTransform: 'uppercase',
    },
    listContainer: {
      display: 'grid',
      gap: '10px',
    },
    personCard: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      borderRadius: '4px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    personName: {
      color: '#00ff00',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    personInfo: {
      color: '#00cc00',
      fontSize: '12px',
      marginBottom: '3px',
    },
    relationshipBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      marginRight: '5px',
      letterSpacing: '0.5px',
    },
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'close_friend': return '#00ff00';
      case 'friend': return '#00ccff';
      case 'acquaintance': return '#ff9900';
      case 'enemy': return '#ff4444';
      default: return '#00ff00';
    }
  };

  const getRelationshipLabel = (relationship) => {
    switch (relationship) {
      case 'close_friend': return 'AMICO STRETTO';
      case 'friend': return 'AMICO';
      case 'acquaintance': return 'CONOSCENTE';
      case 'enemy': return 'NEMICO';
      default: return relationship;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>[ NETWORK LINK ]</h1>

      <div style={styles.toolbar}>
        <button 
          style={{...styles.button, borderColor: '#00ff00'}}
          onClick={() => setShowPersonForm(!showPersonForm)}
        >
          [ AGGIUNGI PERSONA ]
        </button>
        <button 
          style={{...styles.button, borderColor: '#00ccff'}}
          onClick={() => setShowGroupForm(!showGroupForm)}
        >
          [ CREA GRUPPO ]
        </button>
        <button 
          style={{...styles.button, borderColor: '#ff9900'}}
          onClick={() => setViewMode(viewMode === 'list' ? 'graph' : 'list')}
        >
          [ VISTA: {viewMode === 'list' ? 'LISTA' : 'GRAFO'} ]
        </button>
      </div>

      {showPersonForm && (
        <PersonForm 
          onAddPerson={addPerson}
          people={people}
          onAddConnection={addConnection}
        />
      )}

      {showGroupForm && (
        <GroupForm 
          onAddGroup={addGroup}
          people={people}
        />
      )}

      {viewMode === 'list' ? (
        <div style={styles.listContainer}>
          {people.map(person => (
            <div 
              key={person.id}
              style={styles.personCard}
              onClick={() => setSelectedPerson(person.id)}
            >
              <div style={styles.personName}>
                {person.name} {person.surname}
              </div>
              <div style={styles.personInfo}>
                Relationship: {' '}
                <span style={{
                  ...styles.relationshipBadge,
                  backgroundColor: `${getRelationshipColor(person.relationship)}33`,
                  color: getRelationshipColor(person.relationship),
                  border: `1px solid ${getRelationshipColor(person.relationship)}`,
                }}>
                  {getRelationshipLabel(person.relationship)}
                </span>
              </div>
              <div style={styles.personInfo}>
                Met when: {person.metWhen || 'N/A'}
              </div>
              <div style={styles.personInfo}>
                Why: {person.why || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NetworkGraph 
          people={people}
          connections={connections}
        />
      )}
    </div>
  );
}

export default NetworkView;