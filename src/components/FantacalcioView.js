import React, { useState, useEffect } from 'react';
import players from '../data/players';
import lineups from '../data/lineups';

function FantacalcioView({ onBack }) {
  const [mainMode, setMainMode] = useState('visualizza');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
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
  const [buyingPlayer, setBuyingPlayer] = useState(null);
  const [buyPrice, setBuyPrice] = useState('');
  const [auctions, setAuctions] = useState([]);
  const [currentAuction, setCurrentAuction] = useState(null);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [newAuctionName, setNewAuctionName] = useState('');
  const [showAuctionList, setShowAuctionList] = useState(false);
  const [showTeamView, setShowTeamView] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const savedAuctions = localStorage.getItem('fantacalcio_auctions');
    if (savedAuctions) {
      setAuctions(JSON.parse(savedAuctions));
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('fantacalcio_auctions', JSON.stringify(auctions));
  }, [auctions]);

  const createAuction = () => {
    if (newAuctionName.trim()) {
      const newAuction = {
        id: `asta_${Date.now()}`,
        name: newAuctionName.trim(),
        budget: 500,
        calledPlayers: [],
        myTeam: [],
        createdAt: new Date().toISOString(),
      };
      setAuctions([...auctions, newAuction]);
      setCurrentAuction(newAuction);
      setCalledPlayers([]);
      setMyTeam([]);
      setBudget(500);
      setNewAuctionName('');
      setShowAuctionModal(false);
      setShowTeamView(false);
    }
  };

  const loadAuction = (auction) => {
    setCurrentAuction(auction);
    setCalledPlayers(auction.calledPlayers || []);
    setMyTeam(auction.myTeam || []);
    setBudget(auction.budget || 500);
    setShowAuctionList(false);
    setShowTeamView(false);
  };

  const saveAuction = () => {
    if (currentAuction) {
      const updatedAuction = {
        ...currentAuction,
        budget: budget,
        calledPlayers: calledPlayers,
        myTeam: myTeam,
        updatedAt: new Date().toISOString(),
      };
      setAuctions(auctions.map(a => a.id === currentAuction.id ? updatedAuction : a));
      setCurrentAuction(updatedAuction);
      alert('Asta salvata con successo!');
    }
  };

  const deleteAuction = (auctionId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa asta?')) {
      setAuctions(auctions.filter(a => a.id !== auctionId));
      if (currentAuction && currentAuction.id === auctionId) {
        setCurrentAuction(null);
        setCalledPlayers([]);
        setMyTeam([]);
        setBudget(500);
      }
    }
  };

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

  const startBuying = (player) => {
    setBuyingPlayer(player.id);
    setBuyPrice(player.price.toString());
  };

  const confirmBuy = () => {
    if (buyingPlayer && buyPrice !== '') {
      const player = players.find(p => p.id === buyingPlayer);
      if (player) {
        addToTeam(player, parseInt(buyPrice) || 0);
      }
      setBuyingPlayer(null);
      setBuyPrice('');
    }
  };

  const cancelBuy = () => {
    setBuyingPlayer(null);
    setBuyPrice('');
  };

  const addToTeam = (player, price) => {
    if (myTeam.find(p => p.id === player.id)) {
      alert('Giocatore gia in squadra!');
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
    buttonActive: {
      padding: '10px 20px',
      fontSize: '12px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      color: '#00ff00',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
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
    buyPanel: {
      backgroundColor: 'rgba(0, 204, 255, 0.05)',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      padding: '10px',
      marginTop: '8px',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%',
    },
    buyInput: {
      width: '80px',
      padding: '8px',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#00ccff',
      fontFamily: "'Courier New', monospace",
      textAlign: 'center',
      boxSizing: 'border-box',
    },
    buyButton: {
      padding: '8px 15px',
      backgroundColor: 'transparent',
      color: '#00ccff',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      fontSize: '11px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '1px',
      transition: 'all 0.3s',
      fontWeight: 'bold',
    },
    cancelBuyButton: {
      padding: '8px 15px',
      backgroundColor: 'transparent',
      color: '#ff4444',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      fontSize: '11px',
      cursor: 'pointer',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '1px',
      transition: 'all 0.3s',
    },
    auctionModal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#0a0a0a',
      border: '1px solid #ff9900',
      borderRadius: '8px',
      padding: '20px',
      zIndex: 100,
      minWidth: '300px',
      boxShadow: '0 0 30px rgba(255, 153, 0, 0.3)',
    },
    auctionModalTitle: {
      color: '#ff9900',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '15px',
      textAlign: 'center',
    },
    auctionInput: {
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
    auctionList: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#0a0a0a',
      border: '1px solid #ff9900',
      borderRadius: '8px',
      padding: '20px',
      zIndex: 100,
      minWidth: '350px',
      maxHeight: '70vh',
      overflowY: 'auto',
      boxShadow: '0 0 30px rgba(255, 153, 0, 0.3)',
    },
    auctionListItem: {
      backgroundColor: 'rgba(255, 153, 0, 0.05)',
      border: '1px solid rgba(255, 153, 0, 0.3)',
      borderRadius: '4px',
      padding: '10px',
      marginBottom: '8px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.3s',
    },
    auctionListName: {
      color: '#ff9900',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    auctionListInfo: {
      color: '#ff9900',
      fontSize: '11px',
      opacity: '0.7',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 99,
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
        title={label + ': ' + value + '/5'}
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
    const isBuying = buyingPlayer === player.id;
    
    return (
      <div key={player.id} style={{
        ...styles.playerCard,
        opacity: isAstaMode && isCalled ? 0.5 : 1,
        backgroundColor: isAstaMode && isInTeam ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 255, 0, 0.02)',
      }}>
        <div style={{flex: 1, minWidth: '200px'}}>
          <div style={styles.playerName}>
            {starter && <span style={{...styles.statusDot, backgroundColor: '#00ff00', boxShadow: '0 0 5px #00ff00'}} />}
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
            {renderStatValue('Titolarita', player.titol)}
            <span style={{color: '#666', fontSize: '10px'}}>Aff:</span>
            {renderStatValue('Affidabilita', player.affid)}
            <span style={{color: '#666', fontSize: '10px'}}>Int:</span>
            {renderStatValue('Integrita', player.integr)}
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
            {!isInTeam && !isBuying && (
              <button
                onClick={() => startBuying(player)}
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
        
        {isBuying && (
          <div style={styles.buyPanel}>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              style={styles.buyInput}
              min="0"
              autoFocus
            />
            <span style={{color: '#00ccff', fontSize: '11px'}}>crediti</span>
            <button
              onClick={confirmBuy}
              style={styles.buyButton}
            >
              [ CONFERMA ]
            </button>
            <button
              onClick={cancelBuy}
              style={styles.cancelBuyButton}
            >
              [ ANNULLA ]
            </button>
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
              <span style={{...styles.roleLabel, color: roleColors[role]}}>
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
            <label style={styles.advancedLabel}>Titolarita Min:</label>
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
            <label style={styles.advancedLabel}>Affidabilita Min:</label>
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
            <label style={styles.advancedLabel}>Integrita Min:</label>
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

  const renderAuctionModal = () => (
    <>
      <div style={styles.overlay} onClick={() => setShowAuctionModal(false)} />
      <div style={styles.auctionModal}>
        <h2 style={styles.auctionModalTitle}>[ NUOVA ASTA ]</h2>
        <input
          type="text"
          placeholder="Nome asta..."
          value={newAuctionName}
          onChange={(e) => setNewAuctionName(e.target.value)}
          style={styles.auctionInput}
          autoFocus
        />
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
          <button
            onClick={createAuction}
            style={{...styles.button, borderColor: '#ff9900', color: '#ff9900'}}
          >
            [ CREA ]
          </button>
          <button
            onClick={() => setShowAuctionModal(false)}
            style={{...styles.button, borderColor: '#666', color: '#666'}}
          >
            [ ANNULLA ]
          </button>
        </div>
      </div>
    </>
  );

  const renderAuctionList = () => (
    <>
      <div style={styles.overlay} onClick={() => setShowAuctionList(false)} />
      <div style={styles.auctionList}>
        <h2 style={styles.auctionModalTitle}>[ SELEZIONA ASTA ]</h2>
        {auctions.length === 0 ? (
          <p style={{color: '#666', textAlign: 'center'}}>Nessuna asta creata</p>
        ) : (
          auctions.map(auction => (
            <div
              key={auction.id}
              style={styles.auctionListItem}
              onClick={() => loadAuction(auction)}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 153, 0, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 153, 0, 0.05)'}
            >
              <div>
                <div style={styles.auctionListName}>{auction.name}</div>
                <div style={styles.auctionListInfo}>
                  Budget: {auction.budget} | Squadra: {auction.myTeam ? auction.myTeam.length : 0} giocatori
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAuction(auction.id);
                }}
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
          ))
        )}
        {currentAuction && (
          <div style={{marginTop: '15px', padding: '10px', borderTop: '1px solid #ff9900'}}>
            <button
              onClick={saveAuction}
              style={{...styles.button, borderColor: '#00ccff', color: '#00ccff', width: '100%'}}
            >
              [ SALVA ASTA ATTIVA ]
            </button>
          </div>
        )}
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px'}}>
          <button
            onClick={() => {
              setShowAuctionModal(true);
            }}
            style={{...styles.button, borderColor: '#ff9900', color: '#ff9900'}}
          >
            [ NUOVA ASTA ]
          </button>
          <button
            onClick={() => setShowAuctionList(false)}
            style={{...styles.button, borderColor: '#666', color: '#666'}}
          >
            [ CHIUDI ]
          </button>
        </div>
      </div>
    </>
  );

  const renderTeamView = () => (
    <div>
      <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ LA MIA SQUADRA ]</h2>
      
      <div style={styles.statsPanel}>
        <div style={styles.statText}>Asta: {currentAuction ? currentAuction.name : 'Nessuna'}</div>
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
        <button 
          style={mainMode === 'visualizza' ? styles.buttonActive : styles.button}
          onClick={() => {
            setMainMode('visualizza');
            setShowTeamView(false);
          }}
        >
          [ MODALITA: VISUALIZZA ]
        </button>
        
        {mainMode === 'visualizza' && (
          <button style={styles.buttonActive}>
            [ LISTA ]
          </button>
        )}
        
        {mainMode === 'asta' && (
          <>
            <button 
              style={{...styles.button, borderColor: '#ff9900', color: '#ff9900'}}
              onClick={() => {
                setShowAuctionList(true);
                setShowTeamView(false);
              }}
            >
              [ SELEZIONA ASTA ]
            </button>
            <button 
              style={showTeamView ? styles.buttonActive : styles.button}
              onClick={() => setShowTeamView(!showTeamView)}
            >
              [ SQUADRA ]
            </button>
          </>
        )}
        
        <button 
          style={mainMode === 'asta' ? styles.buttonActive : styles.button}
          onClick={() => {
            setMainMode('asta');
            setShowTeamView(false);
          }}
        >
          [ MODALITA: ASTA ]
        </button>
      </div>

      {showAuctionModal && renderAuctionModal()}
      {showAuctionList && renderAuctionList()}

      {mainMode === 'visualizza' ? (
        <div>
          <h2 style={{color: '#00ff00', marginBottom: '15px'}}>[ CONSULTA GIOCATORI ]</h2>
          {renderFilters()}
          {Object.keys(groupedPlayers()).map(category => (
            <div key={category}>
              <h3 style={styles.categoryHeader}>{category}</h3>
              {groupedPlayers()[category].map(player => renderPlayerCard(player, false))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {currentAuction ? (
            <>
              {showTeamView ? (
                renderTeamView()
              ) : (
                <>
                  <div style={{...styles.statsPanel, marginBottom: '15px'}}>
                    <div style={styles.statText}>Asta: {currentAuction.name}</div>
                    <div style={styles.statText}>Crediti rimanenti: {getRemainingBudget()} crediti</div>
                    <div style={styles.statText}>Giocatori in squadra: {myTeam.length}</div>
                  </div>
                  {renderFilters()}
                  {Object.keys(groupedPlayers()).map(category => (
                    <div key={category}>
                      <h3 style={styles.categoryHeader}>{category}</h3>
                      {groupedPlayers()[category].map(player => renderPlayerCard(player, true))}
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <p style={{color: '#ff9900', fontSize: '16px', marginBottom: '20px'}}>
                [ NESSUNA ASTA ATTIVA ]
              </p>
              <p style={{color: '#666', fontSize: '12px', marginBottom: '20px'}}>
                Crea una nuova asta o seleziona un asta esistente
              </p>
              <button
                style={{...styles.button, borderColor: '#ff9900', color: '#ff9900'}}
                onClick={() => setShowAuctionList(true)}
              >
                [ SELEZIONA ASTA ]
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FantacalcioView;