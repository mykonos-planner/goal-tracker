import React, { useState, useEffect } from 'react';
import players from '../data/players';
import lineups from '../data/lineups';

function FantacalcioView({ onBack }) {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [calledPlayers, setCalledPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [budget, setBudget] = useState(500);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const roles = ['all', 'Portiere', 'Difensore Centrale', 'Difensore Sinistro', 'Difensore Destro', 'Mediano', 'Centrocampista', 'Ala', 'Attaccante'];
  const teams = ['all', ...new Set(players.map(p => p.team))].sort();
  const categories = ['all', 'Top', 'Semi-Top', 'Terza Fascia', 'Quarta Fascia', 'Scommesse'];

  const isStarter = (player) => {
    const teamLineup = lineups[player.team];
    if (!teamLineup) return false;
    return teamLineup.starters.includes(player.id);
  };

  const isPossibleStarter = (player) => {
    const teamLineup = lineups[player.team];
    if (!teamLineup) return false;
    return teamLineup.possible.includes(player.id);
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         player.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || player.role === selectedRole;
    const matchesTeam = selectedTeam === 'all' || player.team === selectedTeam;
    const matchesCategory = selectedCategory === 'all' || player.category === selectedCategory;
    return matchesSearch && matchesRole && matchesTeam && matchesCategory;
  });

  const toggleCalled = (playerId) => {
    setCalledPlayers(prev => 
      prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
    );
  };

  const addToTeam = (player, price) => {
    if (myTeam.find(p => p.id === player.id)) {
      alert('Giocatore già in squadra!');
      return;
    }
    setMyTeam([...myTeam, { ...player, paidPrice: price }]);
  };

  const removeFromTeam = (playerId) => {
    setMyTeam(myTeam.filter(p => p.id !== playerId));
  };

  const getRoleCount = (role) => {
    return myTeam.filter(p => p.role === role).length;
  };

  const getTotalSpent = () => {
    return myTeam.reduce((sum, p) => sum + p.paidPrice, 0);
  };

  const getRemainingBudget = () => {
    return budget - getTotalSpent();
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
      padding: '15px',
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
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
    filterRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: '10px',
      marginBottom: '10px',
    },
    playerCard: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      borderRadius: '4px',
      padding: '12px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
    },
    playerName: {
      color: '#00ff00',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    playerInfo: {
      color: '#00cc00',
      fontSize: '11px',
    },
    calledBadge: {
      color: '#ff4444',
      fontSize: '10px',
      fontWeight: 'bold',
    },
    statusDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
      flexShrink: 0,
    },
    teamCard: {
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      borderRadius: '4px',
      padding: '12px',
      marginBottom: '8px',
    },
    statsPanel: {
      backgroundColor: 'rgba(0, 204, 255, 0.05)',
      border: '1px solid rgba(0, 204, 255, 0.3)',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '20px',
    },
    statText: {
      color: '#00ccff',
      fontSize: '12px',
      marginBottom: '5px',
    },
  };

  const renderFilters = () => (
    <div>
      <input
        type="text"
        placeholder="Cerca giocatore o squadra..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />
      <div style={styles.filterRow}>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={styles.select}
        >
          {roles.map(role => (
            <option key={role} value={role}>
              {role === 'all' ? 'Tutti i ruoli' : role}
            </option>
          ))}
        </select>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          style={styles.select}
        >
          {teams.map(team => (
            <option key={team} value={team}>
              {team === 'all' ? 'Tutte le squadre' : team}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Tutte le fasce' : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderListView = () => (
    <div>
      <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ LISTA GIOCATORI ]</h2>
      {renderFilters()}
      {filteredPlayers.map(player => {
        const starter = isStarter(player);
        const possibleStarter = isPossibleStarter(player);
        return (
          <div key={player.id} style={styles.playerCard}>
            <div>
              <div style={styles.playerName}>
                {starter && <span style={{...styles.statusDot, backgroundColor: '#00ff00', boxShadow: '0 0 5px #00ff00'}} />}
                {possibleStarter && <span style={{...styles.statusDot, backgroundColor: '#ff9900', boxShadow: '0 0 5px #ff9900'}} />}
                {!starter && !possibleStarter && <span style={{...styles.statusDot, backgroundColor: '#666'}} />}
                {player.name}
              </div>
              <div style={styles.playerInfo}>
                {player.team} | {player.role} | {player.category}
              </div>
            </div>
            <div>
              <div style={styles.playerInfo}>Prezzo: {player.price} cr</div>
              <div style={styles.playerInfo}>
                Tit: {player.titol} | Aff: {player.affid} | Int: {player.integr}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAstaView = () => (
    <div>
      <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ MODALITÀ ASTA ]</h2>
      {renderFilters()}
      {filteredPlayers.map(player => {
        const isCalled = calledPlayers.includes(player.id);
        const isInTeam = myTeam.find(p => p.id === player.id);
        const starter = isStarter(player);
        const possibleStarter = isPossibleStarter(player);
        return (
          <div key={player.id} style={{
            ...styles.playerCard,
            opacity: isCalled ? 0.5 : 1,
            backgroundColor: isInTeam ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 255, 0, 0.02)',
          }}>
            <div>
              <div style={styles.playerName}>
                {starter && <span style={{...styles.statusDot, backgroundColor: '#00ff00', boxShadow: '0 0 5px #00ff00'}} />}
                {possibleStarter && <span style={{...styles.statusDot, backgroundColor: '#ff9900', boxShadow: '0 0 5px #ff9900'}} />}
                {!starter && !possibleStarter && <span style={{...styles.statusDot, backgroundColor: '#666'}} />}
                {player.name}
                {isCalled && <span style={styles.calledBadge}> [CHIAMATO]</span>}
                {isInTeam && <span style={{color: '#00ff00'}}> [IN SQUADRA]</span>}
              </div>
              <div style={styles.playerInfo}>
                {player.team} | {player.role} | Prezzo: {player.price}
              </div>
            </div>
            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              <button
                onClick={() => toggleCalled(player.id)}
                style={{
                  ...styles.button,
                  padding: '5px 10px',
                  fontSize: '10px',
                  borderColor: isCalled ? '#ff4444' : '#ff9900',
                  color: isCalled ? '#ff4444' : '#ff9900',
                }}
              >
                {isCalled ? 'ANNULLA' : 'CHIAMATO'}
              </button>
              {!isInTeam && (
                <button
                  onClick={() => {
                    const price = prompt(`Prezzo per ${player.name}:`, player.price.toString());
                    if (price !== null) {
                      addToTeam(player, parseInt(price) || 0);
                    }
                  }}
                  style={{
                    ...styles.button,
                    padding: '5px 10px',
                    fontSize: '10px',
                    borderColor: '#00ccff',
                    color: '#00ccff',
                  }}
                >
                  +
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderSquadraView = () => (
    <div>
      <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ LA MIA SQUADRA ]</h2>
      
      <div style={styles.statsPanel}>
        <div style={styles.statText}>Budget iniziale: {budget} crediti</div>
        <div style={styles.statText}>Crediti spesi: {getTotalSpent()} crediti</div>
        <div style={styles.statText}>Crediti rimanenti: {getRemainingBudget()} crediti</div>
        <div style={styles.statText}>Giocatori totali: {myTeam.length}</div>
        <div style={styles.statText}>Portieri: {getRoleCount('Portiere')} (min 2, max 3)</div>
        <div style={styles.statText}>Non portieri: {myTeam.length - getRoleCount('Portiere')} (min 25, max 27)</div>
      </div>
      
      <h3 style={{color: '#00ccff', marginBottom: '10px'}}>[ GIOCATORI PER RUOLO ]</h3>
      {roles.filter(r => r !== 'all').map(role => {
        const count = getRoleCount(role);
        if (count > 0) {
          return (
            <div key={role} style={styles.statText}>
              {role}: {count}
            </div>
          );
        }
        return null;
      })}
      
      <h3 style={{color: '#00ccff', marginBottom: '10px', marginTop: '20px'}}>[ ROSA ]</h3>
      {myTeam.map(player => (
        <div key={player.id} style={styles.teamCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={styles.playerName}>{player.name}</div>
              <div style={styles.playerInfo}>
                {player.team} | {player.role} | Pagato: {player.paidPrice} cr
              </div>
            </div>
            <button
              onClick={() => removeFromTeam(player.id)}
              style={{
                ...styles.button,
                padding: '5px 10px',
                fontSize: '10px',
                borderColor: '#ff4444',
                color: '#ff4444',
              }}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>
        [ ← BACK ]
      </button>
      
      <h1 style={styles.header}>[ FANTACALCIO ]</h1>

      <div style={styles.toolbar}>
        <button style={styles.button} onClick={() => setViewMode('list')}>
          [ LISTA ]
        </button>
        <button style={styles.button} onClick={() => setViewMode('asta')}>
          [ ASTA ]
        </button>
        <button style={styles.button} onClick={() => setViewMode('squadra')}>
          [ SQUADRA ]
        </button>
        {viewMode === 'squadra' && (
          <button
            style={{...styles.button, borderColor: '#ff9900', color: '#ff9900'}}
            onClick={() => {
              const newBudget = prompt('Imposta budget iniziale:', budget.toString());
              if (newBudget !== null) setBudget(parseInt(newBudget) || 500);
            }}
          >
            [ IMPOSTA BUDGET ]
          </button>
        )}
      </div>

      {viewMode === 'list' && renderListView()}
      {viewMode === 'asta' && renderAstaView()}
      {viewMode === 'squadra' && renderSquadraView()}
    </div>
  );
}

export default FantacalcioView;