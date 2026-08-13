import React, { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm';
import DailyCheck from './components/DailyCheck';
import ProgressBars from './components/ProgressBars';
import CalendarView from './components/CalendarView';

function App() {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showDailyCheck, setShowDailyCheck] = useState(false);
  const [viewMode, setViewMode] = useState('progress');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchGoals();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
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
        name: goal.name || 'Obiettivo senza nome',
        startDate: goal.startDate || new Date().toISOString(),
        frequency: goal.frequency || 'daily',
        frequencyDays: goal.frequencyDays || [],
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
    if (!window.confirm('Sei sicuro di voler eliminare TUTTI gli obiettivi? Questa azione non può essere annullata!')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/goals/delete-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete all goals');
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

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Courier New', monospace",
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      border: '1px solid #00ff00',
      padding: '20px',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      position: 'relative',
    },
    title: {
      fontSize: '3em',
      marginBottom: '10px',
      color: '#00ff00',
      textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
      letterSpacing: '5px',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: '1.1em',
      opacity: '0.8',
      color: '#00ff00',
      letterSpacing: '2px',
    },
    timestamp: {
      position: 'absolute',
      top: '10px',
      right: '20px',
      fontSize: '0.8em',
      color: '#00ff00',
      opacity: '0.7',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '12px 24px',
      fontSize: '14px',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      backgroundColor: 'transparent',
      color: '#00ff00',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontFamily: "'Courier New', monospace",
    },
    addButton: {
      borderColor: '#00ff00',
      color: '#00ff00',
    },
    checkButton: {
      borderColor: '#00ccff',
      color: '#00ccff',
    },
    calendarButton: {
      borderColor: '#ff00ff',
      color: '#ff00ff',
    },
    progressButton: {
      borderColor: '#ff9900',
      color: '#ff9900',
    },
    deleteAllButton: {
      borderColor: '#ff4444',
      color: '#ff4444',
    },
    errorMessage: {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      color: '#ff4444',
      padding: '15px',
      borderRadius: '4px',
      marginBottom: '20px',
      textAlign: 'center',
      border: '1px solid #ff4444',
    },
    loadingMessage: {
      textAlign: 'center',
      color: '#00ff00',
      fontSize: '18px',
      padding: '40px',
      border: '1px solid #00ff00',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
    },
    syncStatus: {
      textAlign: 'center',
      color: '#00ff00',
      fontSize: '12px',
      marginTop: '20px',
      opacity: '0.6',
      letterSpacing: '1px',
    },
    dangerZone: {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      padding: '20px',
      borderRadius: '4px',
      marginBottom: '30px',
      border: '1px solid #ff4444',
    },
    dangerTitle: {
      color: '#ff4444',
      marginBottom: '15px',
      textAlign: 'center',
      letterSpacing: '2px',
    },
  };

  if (loading && goals.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Organizer</h1>
        </div>
        <div style={styles.loadingMessage}>
          <h2>Inizializzazione...</h2>
          <p>Connessione al database...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Organizer</h1>
        <p style={styles.subtitle}>// Sistema di monitoraggio obiettivi</p>
        <div style={styles.timestamp}>
          {currentTime.toLocaleString('it-IT')}
        </div>
      </div>

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

      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, ...styles.addButton}}
          onClick={() => setShowAddGoal(!showAddGoal)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.boxShadow = 'none';
          }}
        >
          {showAddGoal ? '[ CLOSE ]' : '[ NEW TASK ]'}
        </button>
        
        <button 
          style={{...styles.button, ...styles.checkButton}}
          onClick={() => setShowDailyCheck(!showDailyCheck)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 204, 255, 0.1)';
            e.target.style.boxShadow = '0 0 20px rgba(0, 204, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.boxShadow = 'none';
          }}
        >
          {showDailyCheck ? '[ CLOSE ]' : '[ DAILY CHECK ]'}
        </button>

        <button 
          style={{...styles.button, ...styles.progressButton}}
          onClick={() => setViewMode('progress')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 153, 0, 0.1)';
            e.target.style.boxShadow = '0 0 20px rgba(255, 153, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.boxShadow = 'none';
          }}
        >
          [ PROGRESS VIEW ]
        </button>

        <button 
          style={{...styles.button, ...styles.calendarButton}}
          onClick={() => setViewMode('calendar')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 0, 255, 0.1)';
            e.target.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.boxShadow = 'none';
          }}
        >
          [ CALENDAR VIEW ]
        </button>

        <button 
          style={{...styles.button, ...styles.deleteAllButton}}
          onClick={() => setShowDeleteAll(!showDeleteAll)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
            e.target.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.boxShadow = 'none';
          }}
        >
          {showDeleteAll ? '[ CANCEL ]' : '[ PURGE ALL ]'}
        </button>
      </div>

      {showDeleteAll && (
        <div style={styles.dangerZone}>
          <h3 style={styles.dangerTitle}>⚠ WARNING: DESTRUCTIVE OPERATION</h3>
          <p style={{textAlign: 'center', marginBottom: '20px', color: '#ff4444'}}>
            This action will permanently delete all tasks. This cannot be undone!
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
            <button 
              style={{...styles.button, ...styles.deleteAllButton}}
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
      {showDailyCheck && (
        <DailyCheck 
          goals={goals} 
          onToggleCheck={toggleTodayCheck} 
        />
      )}
      
      {viewMode === 'progress' ? (
        <ProgressBars 
          goals={goals} 
          onDeleteGoal={deleteGoal}
        />
      ) : (
        <CalendarView goals={goals} />
      )}

      <div style={styles.syncStatus}>
        <p>[ DATABASE SYNCED ] | [ TASKS: {goals.length} ]</p>
      </div>
    </div>
  );
}

export default App;