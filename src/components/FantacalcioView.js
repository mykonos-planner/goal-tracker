import React, { useState, useEffect } from 'react';
import players from '../data/players';
import lineups from '../data/lineups';

function FantacalcioView({ onBack }) {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]); // Ora è un array
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minTitol, setMinTitol] = useState('');
  const [minAffid, setMinAffid] = useState('');
  const [minIntegr, setMinIntegr] = useState('');
  const [calledPlayers, setCalledPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [budget, setBudget] = useState(500);
  const [isMobile, setIsMobile] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedBallottaggio, setExpandedBallottaggio] = useState(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const roleColors = {
    'Por': '#ffff00',
    'Ds': '#00ff00',
    'Dd': '#00ff00',
    'Dc': '#00ff00',
    'B': '#00ff00',
    'E': '#00ccff',
    'M': '#00ccff',
    'C': '#00ccff',
    'T': '#9b59b6',
    'W': '#9b59b6',
    'A': '#ff4444',
    'Pc': '#ff4444',
  };

  const roleNames = {
    'Por': 'Portiere',
    'Ds': 'Difensore Sinistro',
    'Dd': 'Difensore Destro',
    'Dc': 'Difensore Centrale',
    'B': 'Braccetto',
    'E': 'Esterno',
    'M': 'Mediano',
    'C': 'Centrocampista',
    'T': 'Trequartista',
    'W': 'Ala',
    'A': 'Attaccante',
    'Pc': 'Prima Punta',
  };

  const categoryOrder = ['Top', 'Semi-Top', 'Terza Fascia', 'Quarta Fascia', 'Scommesse'];

  const allRoles = ['Por', 'Ds', 'Dd', 'Dc', 'B', 'E', 'M', 'C', 'T', 'W', 'A', 'Pc'];
  const teams = ['all', ...new Set(players.map(p => p.team))].sort();
  const categories = ['all', ...categoryOrder];

  const toggleRole = (role) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const clearRoles = () => {
    setSelectedRoles([]);
  };

  const getBallottaggio = (player) => {
    const teamLineup = lineups[player.team];
    if (!teamLineup || !teamLineup.possible || !teamLineup.possible.includes(player.id)) {
      return null;
    }
    
    const allPossible = teamLineup.possible;
    const playerData = players.find(p => p.id === player.id);
    if (!playerData) return null;
    
    const sameRolePlayers = allPossible.filter(pid => {
      const p = players.find(pp => pp.id === pid);
      return p && p.roles.some(r => playerData.roles.includes(r));
    });
    
    if (sameRolePlayers.length > 1) {
      const otherPlayer = sameRolePlayers.find(pid => pid !== player.id);
      if (otherPlayer) {
        const otherData = players.find(p => p.id === otherPlayer);
        return otherData ? otherData.name : null;
      }
    }
    
    return null;
  };

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

  const getStatColor = (value) => {
    if (value === undefined || value === null || value === 0) return '#666666';
    if (value >= 4) return '#00ff00';
    if (value === 3) return '#ff9900';
    return '#ff4444';
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         player.team.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Se non ci sono ruoli selezionati, mostra tutti
    const matchesRole = selectedRoles.length === 0 || 
      selectedRoles.every(role => player.roles && player.roles.includes(role));
    
    const matchesTeam = selectedTeam === 'all' || player.team === selectedTeam;
    const matchesCategory = selectedCategory === 'all' || player.category === selectedCategory;
    
    const matchesMinPrice = minPrice === '' || player.price >= parseInt(minPrice);
    const matchesMaxPrice = maxPrice === '' || player.price <= parseInt(maxPrice);
    const matchesMinTitol = minTitol === '' || player.titol >= parseInt(minTitol);
    const matchesMinAffid = minAffid === '' || player.affid >= parseInt(minAffid);
    const matchesMinIntegr = minIntegr === '' || player.integr >= parseInt(minIntegr);
    
    return matchesSearch && matchesRole && matchesTeam && matchesCategory && 
           matchesMinPrice && matchesMaxPrice && matchesMinTitol && matchesMinAffid && matchesMinIntegr;
  });

  const groupedPlayers = () => {
    const grouped = {};
    categoryOrder.forEach(cat => {
      const playersInCat = filteredPlayers.filter(p => p.category === cat);
      if (playersInCat.length > 0) {
        grouped[cat] = playersInCat;
      }
    });
    return grouped;
  };

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
    return myTeam.filter(p => p.roles && p.roles.includes(role)).length;
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
    roleSelectorContainer: {
      marginBottom: '10px',
    },
    roleSelectorButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'transparent',
      color: '#00ff00',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '1px',
      textTransform: 'uppercase',
      textAlign: 'left',
    },
    roleSelectorDropdown: {
      backgroundColor: '#0a0a0a',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      padding: '10px',
      marginTop: '5px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    roleCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
      padding: '5px 10px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      borderRadius: '4px',
      transition: 'all 0.3s',
    },
    roleCheckboxSelected: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
      padding: '5px 10px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      transition: 'all 0.3s',
    },
    checkbox: {
      accentColor: '#00ff00',
      cursor: 'pointer',
    },
    roleLabel: {
      color: '#00ff00',
      fontSize: '11px',
      letterSpacing: '0.5px',
    },
    clearRolesButton: {
      padding: '5px 10px',
      backgroundColor: 'transparent',
      color: '#ff4444',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      fontSize: '10px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '1px',
      marginLeft: 'auto',
    },
    selectedRolesInfo: {
      color: '#ff9900',
      fontSize: '11px',
      letterSpacing: '0.5px',
      marginTop: '5px',
    },
    advancedFiltersRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr 1fr',
      gap: '10px',
      marginBottom: '10px',
    },
    advancedInput: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '12px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#ff9900',
      fontFamily: "'Courier New', monospace",
      boxSizing: 'border-box',
    },
    advancedLabel: {
      color: '#ff9900',
      fontSize: '10px',
      letterSpacing: '1px',
      marginBottom: '5px',
      display: 'block',
    },
    categoryHeader: {
      color: '#ff9900',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '10px',
      letterSpacing: '2px',
      borderBottom: '1px solid #ff9900',
      paddingBottom: '5px',
      textTransform: 'uppercase',
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
      fontSize: '15px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    },
    playerInfo: {
      color: '#00cc00',
      fontSize: '12px',
    },
    priceBadge: {
      color: '#ff9900',
      fontSize: '15px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
    },
    statValue: {
      fontSize: '13px',
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      padding: '2px 6px',
      borderRadius: '3px',
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
      cursor: 'pointer',
    },
    roleBadge: {
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: '8px',
      fontSize: '9px',
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      marginRight: '3px',
    },
    ballottaggioInfo: {
      color: '#ff9900',
      fontSize: '11px',
      letterSpacing: '0.5px',
      marginTop: '3px',
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
    toggleFiltersButton: {
      width: '100%',
      padding: '8px',
      backgroundColor: 'transparent',
      color: '#ff9900',
      border: '1px solid #ff9900',
      borderRadius: '4px',
      fontSize: '11px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '1px',
      marginBottom: '10px',
      textTransform: 'uppercase',
    },
  };

  const renderRoleBadges = (player) => {
    if (!player.roles || player.roles.length === 0) return null;
    return player.roles.map(role => (
      <span
        key={role}
        style={{
          ...styles.roleBadge,
          backgroundColor: `${roleColors[role]}22`,
          color: roleColors[role],
          border: `1px solid ${roleColors[role]}`,
        }}
        title={roleNames[role] || role}
      >
        {role}
      </span>
    ));
  };

  const renderStatValue = (label, value) => {
    const color = getStatColor(value);
    return (
      <span
        style={{
          ...styles.statValue,
          color: color,
          backgroundColor: `${color}22`,
          border: `1px solid ${color}`,
        }}
        title={`${label}: ${value}/5`}
      >
        {value}
      </span>
    );
  };

  const renderPlayerCard = (player, isAstaMode = false) => {
    const isCalled = calledPlayers.includes(player.id);
    const isInTeam = myTeam.find(p => p.id === player.id);
    const starter = isStarter(player);
    const possibleStarter = isPossibleStarter(player);
    const ballottaggio = getBallottaggio(player);
    const isExpanded = expandedBallottaggio === player.id;
    
    return (
      <div key={player.id} style={{
        ...styles.playerCard,
        opacity: isAstaMode && isCalled ? 0.5 : 1,
        backgroundColor: isAstaMode && isInTeam ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 255, 0, 0.02)',
      }}>
        <div style={{flex: 1, minWidth: '200px'}}>
          <div style={styles.playerName}>
            {starter && <span 
              style={{...styles.statusDot, backgroundColor: '#00ff00', boxShadow: '0 0 5px #00ff00'}} 
            />}
            {possibleStarter && <span 
              style={{...styles.statusDot, backgroundColor: '#ff9900', boxShadow: '0 0 5px #ff9900', cursor: 'pointer'}}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedBallottaggio(isExpanded ? null : player.id);
              }}
              title="Clicca per vedere il ballottaggio"
            />}
            {!starter && !possibleStarter && <span style={{...styles.statusDot, backgroundColor: '#666'}} />}
            {player.name}
            {renderRoleBadges(player)}
            {isAstaMode && isCalled && <span style={styles.calledBadge}> [CHIAMATO]</span>}
            {isAstaMode && isInTeam && <span style={{color: '#00ff00'}}> [IN SQUADRA]</span>}
          </div>
          <div style={styles.playerInfo}>
            {player.team}
          </div>
          {isExpanded && ballottaggio && (
            <div style={styles.ballottaggioInfo}>
              Ballottaggio: {ballottaggio}
            </div>
          )}
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={styles.priceBadge}>
            {player.price} crediti
          </div>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <span style={{color: '#666', fontSize: '10px'}}>Tit:</span>
            {renderStatValue('Titolarità', player.titol)}
            <span style={{color: '#666', fontSize: '10px'}}>Aff:</span>
            {renderStatValue('Affidabilità', player.affid)}
            <span style={{color: '#666', fontSize: '10px'}}>Int:</span>
            {renderStatValue('Integrità', player.integr)}
          </div>
        </div>
        
        {isAstaMode && (
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
        )}
      </div>
    );
  };

  const renderRoleSelector = () => (
    <div style={styles.roleSelectorContainer}>
      <button 
        style={styles.roleSelectorButton}
        onClick={() => setShowRoleSelector(!showRoleSelector)}
      >
        [ SELEZIONA RUOLI {selectedRoles.length > 0 ? `(${selectedRoles.length})` : ''} ▼ ]
      </button>
      
      {showRoleSelector && (
        <div style={styles.roleSelectorDropdown}>
          {allRoles.map(role => (
            <div
              key={role}
              style={selectedRoles.includes(role) ? styles.roleCheckboxSelected : styles.roleCheckbox}
              onClick={() => toggleRole(role)}
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
                style={styles.checkbox}
                onClick={(e) => e.stopPropagation()}
              />
              <span style={{
                ...styles.roleLabel,
                color: roleColors[role],
              }}>
                {role} - {roleNames[role]}
              </span>
            </div>
          ))}
          {selectedRoles.length > 0 && (
            <button
              style={styles.clearRolesButton}
              onClick={(e) => {
                e.stopPropagation();
                clearRoles();
              }}
            >
              [ CLEAR ]
            </button>
          )}
        </div>
      )}
      
      {selectedRoles.length > 0 && (
        <div style={styles.selectedRolesInfo}>
          Filtro: {selectedRoles.join(' + ')} (deve avere TUTTI questi ruoli)
        </div>
      )}
    </div>
  );

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
        {renderRoleSelector()}
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
      
      <button 
        style={styles.toggleFiltersButton}
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        {showAdvancedFilters ? '[ NASCONDI FILTRI AVANZATI ]' : '[ MOSTRA FILTRI AVANZATI ]'}
      </button>
      
      {showAdvancedFilters && (
        <div style={styles.advancedFiltersRow}>
          <div>
            <label style={styles.advancedLabel}>Crediti Min:</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={styles.advancedInput}
              min="0"
            />
          </div>
          <div>
            <label style={styles.advancedLabel}>Crediti Max:</label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={styles.advancedInput}
              min="0"
            />
          </div>
          <div>
            <label style={styles.advancedLabel}>Titolarità Min:</label>
            <input
              type="number"
              placeholder="1-5"
              value={minTitol}
              onChange={(e) => setMinTitol(e.target.value)}
              style={styles.advancedInput}
              min="1"
              max="5"
            />
          </div>
          <div>
            <label style={styles.advancedLabel}>Affidabilità Min:</label>
            <input
              type="number"
              placeholder="1-5"
              value={minAffid}
              onChange={(e) => setMinAffid(e.target.value)}
              style={styles.advancedInput}
              min="1"
              max="5"
            />
          </div>
          <div>
            <label style={styles.advancedLabel}>Integrità Min:</label>
            <input
              type="number"
              placeholder="1-5"
              value={minIntegr}
              onChange={(e) => setMinIntegr(e.target.value)}
              style={styles.advancedInput}
              min="1"
              max="5"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderListView = () => {
    const grouped = groupedPlayers();
    return (
      <div>
        <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ LISTA GIOCATORI ]</h2>
        {renderFilters()}
        {Object.keys(grouped).map(category => (
          <div key={category}>
            <h3 style={styles.categoryHeader}>
              {category}
            </h3>
            {grouped[category].map(player => renderPlayerCard(player, false))}
          </div>
        ))}
      </div>
    );
  };

  const renderAstaView = () => {
    const grouped = groupedPlayers();
    return (
      <div>
        <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ MODALITÀ ASTA ]</h2>
        {renderFilters()}
        {Object.keys(grouped).map(category => (
          <div key={category}>
            <h3 style={styles.categoryHeader}>
              {category}
            </h3>
            {grouped[category].map(player => renderPlayerCard(player, true))}
          </div>
        ))}
      </div>
    );
  };

  const renderSquadraView = () => (
    <div>
      <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ LA MIA SQUADRA ]</h2>
      
      <div style={styles.statsPanel}>
        <div style={styles.statText}>Budget iniziale: {budget} crediti</div>
        <div style={styles.statText}>Crediti spesi: {getTotalSpent()} crediti</div>
        <div style={styles.statText}>Crediti rimanenti: {getRemainingBudget()} crediti</div>
        <div style={styles.statText}>Giocatori totali: {myTeam.length}</div>
        <div style={styles.statText}>Portieri: {getRoleCount('Por')} (min 2, max 3)</div>
        <div style={styles.statText}>Non portieri: {myTeam.length - getRoleCount('Por')} (min 25, max 27)</div>
      </div>
      
      <h3 style={{color: '#00ccff', marginBottom: '10px'}}>[ GIOCATORI PER RUOLO ]</h3>
      {allRoles.map(role => {
        const count = getRoleCount(role);
        if (count > 0) {
          return (
            <div key={role} style={styles.statText}>
              {role} ({roleNames[role]}): {count}
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
              <div style={styles.playerName}>
                {player.name}
                {renderRoleBadges(player)}
              </div>
              <div style={styles.playerInfo}>
                {player.team} | Pagato: {player.paidPrice} crediti
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