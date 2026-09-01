import React, { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm';
import ProgressBars from './components/ProgressBars';
import CalendarView from './components/CalendarView';
import TodayView from './components/TodayView';
import NetworkView from './components/NetworkView';
import FantacalcioView from './components/FantacalcioView';

function App() {
  const [goals, setGoals] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [viewMode, setViewMode] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchGoals();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      
      const goalsArray = Array.isArray(data) ? data : [];
      
      const normalizedGoals = goalsArray.map(goal => ({
        ...goal,
        id: goal.id || goal._id || `goal_${Date.now()}`,
        dailyHistory: goal.dailyHistory || [],
        checkedToday: goal.checkedToday || false,
        duration: goal.duration || 0,
        durationType: goal.durationType || 'days',
        name: goal.name || 'Obiettivo senza nome',
        description: goal.description || '',
        startDate: goal.startDate || new Date().toISOString(),
        frequency: goal.frequency || 'daily',
        frequencyDays: goal.frequencyDays || [],
        color: goal.color || '#00ff00',
      }));
      
      setGoals(normalizedGoals);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Errore nel caricamento degli obiettivi dal database');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (newGoal) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add goal');
      }
      
      const createdGoal = await response.json();
      
      setGoals(prevGoals => [createdGoal, ...prevGoals]);
      setShowAddGoal(false);
      setError(null);
      
      await fetchGoals();
      
      return true;
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Errore nell\'aggiunta dell\'obiettivo');
      alert('Errore nell\'aggiunta dell\'obiettivo: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const encodedId = encodeURIComponent(goalId);
      
      const response = await fetch(`/api/goals/${encodedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete goal');
      }
      
      setGoals(prevGoals => prevGoals.filter(goal => {
        const goalIdToCheck = goal.id || goal._id;
        return goalIdToCheck !== goalId;
      }));
      
      setError(null);
      await fetchGoals();
      
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Errore nell\'eliminazione dell\'obiettivo');
      alert('Errore nell\'eliminazione dell\'obiettivo: ' + err.message);
    }
  };

  const deleteAllGoals = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/goals/delete-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete-all' }),
      });
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete all goals');
      }
      
      setGoals([]);
      setError(null);
      setShowDeleteAll(false);
      
      await fetchGoals();
      
      alert('Tutti gli obiettivi sono stati eliminati!');
      
    } catch (err) {
      console.error('Error deleting all goals:', err);
      setError('Errore nell\'eliminazione di tutti gli obiettivi');
      alert('Errore nell\'eliminazione: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodayCheck = async (goalId, checked) => {
    try {
      const response = await fetch('/api/daily-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goalId, checked }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update check');
      }
      
      const updatedGoal = await response.json();
      
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          const goalIdToCheck = goal.id || goal._id;
          return goalIdToCheck === goalId ? updatedGoal : goal;
        })
      );
      setError(null);
      
      await fetchGoals();
      
    } catch (err) {
      console.error('Error updating check:', err);
      setError('Errore nell\'aggiornamento del check');
      alert('Errore nell\'aggiornamento del check: ' + err.message);
    }
  };

  const toggleDateCheck = async (goalId, date, checked) => {
    try {
      const dateString = date.toDateString();
      
      const response = await fetch('/api/daily-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          goalId, 
          checked,
          date: dateString
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update check');
      }
      
      const updatedGoal = await response.json();
      
      setGoals(prevGoals => 
        prevGoals.map(goal => {
          const goalIdToCheck = goal.id || goal._id;
          return goalIdToCheck === goalId ? updatedGoal : goal;
        })
      );
      
      await fetchGoals();
      
    } catch (err) {
      console.error('Error updating date check:', err);
      alert('Errore nell\'aggiornamento del check');
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '5px' : '20px',
      fontFamily: "'Courier New', monospace",
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '15px' : '20px',
      padding: isMobile ? '10px' : '20px',
      borderBottom: '1px solid #00ff00',
      position: 'relative',
    },
    title: {
      fontSize: isMobile ? '1.5em' : '2.5em',
      marginBottom: '10px',
      color: '#00ff00',
      letterSpacing: '3px',
      fontWeight: 'normal',
    },
    subtitle: {
      fontSize: '0.9em',
      opacity: '0.7',
      color: '#00ff00',
      letterSpacing: '1px',
    },
    timestamp: {
      position: isMobile ? 'static' : 'absolute',
      top: isMobile ? 'auto' : '10px',
      right: isMobile ? 'auto' : '20px',
      fontSize: '0.7em',
      color: '#00ff00',
      opacity: '0.6',
      marginTop: isMobile ? '5px' : '0',
    },
    mainMenu: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    menuCard: {
      padding: isMobile ? '20px' : '30px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'center',
      minWidth: isMobile ? '100%' : '200px',
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
    },
    menuCardTitle: {
      fontSize: '1.1em',
      color: '#00ff00',
      marginBottom: '10px',
      letterSpacing: '2px',
    },
    menuCardDescription: {
      fontSize: '0.8em',
      color: '#00cc00',
      opacity: '0.7',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: isMobile ? '5px' : '10px',
      marginBottom: '20px',
      flexWrap: 'nowrap',
      padding: isMobile ? '8px' : '15px',
      backgroundColor: 'rgba(0, 255, 0, 0.02)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.2)',
      width: '100%',
      boxSizing: 'border-box',
    },
    button: {
      padding: isMobile ? '10px 12px' : '10px 20px',
      fontSize: isMobile ? '9px' : '12px',
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
      flex: isMobile ? '1' : '0 0 auto',
      whiteSpace: 'nowrap',
      fontWeight: 'bold',
    },
    dropdownContainer: {
      position: 'relative',
      display: 'inline-block',
      flex: isMobile ? '1' : '0 0 auto',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0a0a0a',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      marginTop: '5px',
      zIndex: 1000,
      minWidth: isMobile ? '120px' : '200px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
    },
    dropdownItem: {
      padding: isMobile ? '12px 15px' : '12px 20px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: '#00ff00',
      fontSize: isMobile ? '10px' : '12px',
      letterSpacing: isMobile ? '0.5px' : '1px',
      borderBottom: '1px solid rgba(0, 255, 0, 0.1)',
      whiteSpace: 'nowrap',
      display: 'block',
      width: '100%',
      textAlign: 'left',
      backgroundColor: 'transparent',
      fontFamily: "'Courier New', monospace",
      textTransform: 'uppercase',
    },
    errorMessage: {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      color: '#ff4444',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px',
      textAlign: 'center',
      border: '1px solid #ff4444',
      fontSize: '12px',
    },
    loadingMessage: {
      textAlign: 'center',
      color: '#00ff00',
      fontSize: '16px',
      padding: '40px',
      border: '1px solid #00ff00',
      backgroundColor: 'rgba(0, 255, 0, 0.03)',
    },
    syncStatus: {
      textAlign: 'center',
      color: '#00ff00',
      fontSize: '10px',
      marginTop: '20px',
      opacity: '0.6',
      letterSpacing: '1px',
    },
    dangerZone: {
      backgroundColor: 'rgba(255, 0, 0, 0.05)',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px',
      border: '1px solid #ff4444',
    },
    dangerTitle: {
      color: '#ff4444',
      marginBottom: '10px',
      textAlign: 'center',
      letterSpacing: '1px',
      fontSize: '14px',
    },
    backButton: {
      marginBottom: isMobile ? '10px' : '15px',
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
    sectionTitle: {
      color: '#00ff00',
      fontSize: isMobile ? '1.2em' : '1.5em',
      marginBottom: '20px',
      letterSpacing: '2px',
      textAlign: 'center',
    },
  };

  if (loading && goals.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Organizer</h1>
        </div>
        <div style={styles.loadingMessage}>
          <h2>Initializing...</h2>
          <p>Connecting to database...</p>
        </div>
      </div>
    );
  }

  if (currentSection === 'home') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Organizer</h1>
          <p style={styles.subtitle}>// Personal Task Management System</p>
          <div style={styles.timestamp}>
            {currentTime.toLocaleString('it-IT')}
          </div>
        </div>

        <div style={styles.mainMenu}>
          <div 
            style={styles.menuCard}
            onClick={() => setCurrentSection('goals')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.02)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={styles.menuCardTitle}>[ OBJECTIVES ]</div>
            <div style={styles.menuCardDescription}>
              Track your daily goals
            </div>
          </div>
          
          <div 
            style={styles.menuCard}
            onClick={() => setCurrentSection('network')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 204, 255, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 204, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.02)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={styles.menuCardTitle}>[ NETWORK LINK ]</div>
            <div style={styles.menuCardDescription}>
              Manage your connections
            </div>
          </div>
          
          <div 
            style={styles.menuCard}
            onClick={() => setCurrentSection('fantacalcio')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 153, 0, 0.1)';
              e.target.style.boxShadow = '0 0 20px rgba(255, 153, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.02)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <div style={styles.menuCardTitle}>[ FANTACALCIO ]</div>
            <div style={styles.menuCardDescription}>
              Gestisci la tua asta
            </div>
          </div>
        </div>

        <div style={styles.syncStatus}>
          <p>[ SYSTEM READY ] | [ {currentTime.toLocaleTimeString('it-IT')} ]</p>
        </div>
      </div>
    );
  }

  if (currentSection === 'network') {
    return <NetworkView onBack={() => setCurrentSection('home')} />;
  }

  if (currentSection === 'fantacalcio') {
    return <FantacalcioView onBack={() => setCurrentSection('home')} />;
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.backButton}
        onClick={() => {
          setCurrentSection('home');
          setShowAddGoal(false);
        }}
      >
        [ ← BACK ]
      </button>

      <h1 style={styles.sectionTitle}>[ OBJECTIVES ]</h1>

      {error && (
        <div style={styles.errorMessage}>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchGoals();
            }}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#ff4444',
              border: '1px solid #ff4444',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Courier New', monospace",
            }}
          >
            [ RETRY ]
          </button>
        </div>
      )}

      <div style={styles.toolbar}>
        <button 
          style={{...styles.button, borderColor: '#00ff00'}}
          onClick={() => setShowAddGoal(!showAddGoal)}
        >
          {showAddGoal ? '[CLOSE]' : '[NEW TASK]'}
        </button>

        <div style={styles.dropdownContainer}>
          <button 
            style={{...styles.button, borderColor: '#ff9900', width: '100%'}}
            onClick={() => setShowViewMenu(!showViewMenu)}
          >
            [VIEW: {viewMode === 'progress' ? 'PROG' : viewMode === 'calendar' ? 'CAL' : 'TODAY'}] ▼
          </button>
          {showViewMenu && (
            <div style={styles.dropdownMenu}>
              <button 
                style={styles.dropdownItem}
                onClick={() => {
                  setViewMode('today');
                  setShowViewMenu(false);
                }}
              >
                [ TODAY VIEW ]
              </button>
              <button 
                style={styles.dropdownItem}
                onClick={() => {
                  setViewMode('progress');
                  setShowViewMenu(false);
                }}
              >
                [ PROGRESS VIEW ]
              </button>
              <button 
                style={styles.dropdownItem}
                onClick={() => {
                  setViewMode('calendar');
                  setShowViewMenu(false);
                }}
              >
                [ CALENDAR VIEW ]
              </button>
            </div>
          )}
        </div>

        <button 
          style={{...styles.button, borderColor: '#ff4444', color: '#ff4444'}}
          onClick={() => setShowDeleteAll(!showDeleteAll)}
        >
          {showDeleteAll ? '[CANCEL]' : '[PURGE ALL]'}
        </button>
      </div>

      {showDeleteAll && (
        <div style={styles.dangerZone}>
          <h3 style={styles.dangerTitle}>⚠ WARNING: DESTRUCTIVE OPERATION</h3>
          <p style={{textAlign: 'center', marginBottom: '15px', color: '#ff4444', fontSize: '11px'}}>
            This action will permanently delete all tasks!
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap'}}>
            <button 
              style={{...styles.button, borderColor: '#ff4444', color: '#ff4444'}}
              onClick={deleteAllGoals}
            >
              [ CONFIRM PURGE ]
            </button>
            <button 
              style={{...styles.button, borderColor: '#666', color: '#666'}}
              onClick={() => setShowDeleteAll(false)}
            >
              [ CANCEL ]
            </button>
          </div>
        </div>
      )}

      {showAddGoal && <GoalForm onAddGoal={addGoal} />}
      
      {viewMode === 'progress' ? (
        <ProgressBars 
          goals={goals} 
          onDeleteGoal={deleteGoal}
        />
      ) : viewMode === 'calendar' ? (
        <CalendarView 
          goals={goals} 
          onToggleDateCheck={toggleDateCheck}
        />
      ) : (
        <TodayView 
          goals={goals} 
          onToggleCheck={toggleTodayCheck}
        />
      )}

      <div style={styles.syncStatus}>
        <p>[ SYNCED ] | [ TASKS: {goals.length} ]</p>
      </div>
    </div>
  );
}

export default App;