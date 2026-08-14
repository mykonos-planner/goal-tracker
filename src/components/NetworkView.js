import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import PersonForm from './PersonForm';
import GroupForm from './GroupForm';

function NetworkView({ onBack }) {
  const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState([]);
  const [connections, setConnections] = useState([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchNetworkData();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
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
        
        // Crea connessione con me
        if (personData.relationship) {
          await fetch('/api/network/connections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'me',
              to: newPerson.id,
              type: personData.relationship
            })
          });
          fetchNetworkData();
        }
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

  const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    header: {
      color: '#00ff00',
      fontSize: isMobile ? '1.2em' : '1.5em',
      marginBottom: '20px',
      letterSpacing: '2px',
      textAlign: 'center',
    },
    backButton: {
      marginBottom: '15px',
      padding: isMobile ? '6px 12px' : '8px 16px',
      backgroundColor: 'transparent',
      color: '#00ff00',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      fontSize: isMobile ? '10px' : '11px',
      letterSpacing: '1px',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    button: {
      padding: isMobile ? '10px 14px' : '10px 20px',
      fontSize: isMobile ? '10px' : '12px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#00ff00',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
      textTransform: 'uppercase',
      minHeight: isMobile ? '40px' : 'auto',
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
      width: '100%',
      boxSizing: 'border-box',
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
    emptyMessage: {
      textAlign: 'center',
      color: '#00cc00',
      padding: '40px',
      fontSize: '14px',
      letterSpacing: '1px',
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
      <button 
        style={styles.backButton}
        onClick={onBack}
      >
        [ ← BACK ]
      </button>
      
      <h1 style={styles.header}>[ NETWORK LINK ]</h1>

      <div style={styles.toolbar}>
        <button 
          style={{...styles.button, borderColor: '#00ff00'}}
          onClick={() => {
            setShowPersonForm(!showPersonForm);
            setShowGroupForm(false);
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {showPersonForm ? '[CLOSE]' : '[ADD PERSON]'}
        </button>
        <button 
          style={{...styles.button, borderColor: '#00ccff', color: '#00ccff'}}
          onClick={() => {
            setShowGroupForm(!showGroupForm);
            setShowPersonForm(false);
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 204, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {showGroupForm ? '[CLOSE]' : '[CREATE GROUP]'}
        </button>
        <button 
          style={{...styles.button, borderColor: '#ff9900', color: '#ff9900'}}
          onClick={() => setViewMode(viewMode === 'list' ? 'graph' : 'list')}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 153, 0, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          [VIEW: {viewMode === 'list' ? 'LIST' : 'GRAPH'}]
        </button>
      </div>

      {showPersonForm && (
        <PersonForm 
          onAddPerson={addPerson}
          people={people}
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
          {people.length === 0 ? (
            <div style={styles.emptyMessage}>
              [ NO PEOPLE ADDED YET ]
            </div>
          ) : (
            people.map(person => (
              <div 
                key={person.id}
                style={styles.personCard}
                onClick={() => setSelectedPerson(person.id)}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.05)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.02)'}
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
            ))
          )}
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