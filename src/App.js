import React, { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm';
import DailyCheck from './components/DailyCheck';
import ProgressBars from './components/ProgressBars';
import CalendarView from './components/CalendarView';

function App() {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showDailyCheck, setShowDailyCheck] = useState(false);
  const [viewMode, setViewMode] = useState('progress'); // 'progress' o 'calendar'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  useEffect(() => {
    fetchGoals();
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
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '30px',
    },
    title: {
      fontSize: '2.5em',
      marginBottom: '10px',
    },
    subtitle: {
      fontSize: '1.1em',
      opacity: '0.9',
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
      fontSize: '16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    addButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    checkButton: {
      backgroundColor: '#2196F3',
      color: 'white',
    },
    calendarButton: {
      backgroundColor: '#9C27B0',
      color: 'white',
    },
    progressButton: {
      backgroundColor: '#FF9800',
      color: 'white',
    },
    deleteAllButton: {
      backgroundColor: '#ff4444',
      color: 'white',
    },
    errorMessage: {
      backgroundColor: '#ff4444',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    loadingMessage: {
      textAlign: 'center',
      color: 'white',
      fontSize: '18px',
      padding: '40px',
    },
    syncStatus: {
      textAlign: 'center',
      color: 'white',
      fontSize: '12px',
      marginTop: '20px',
      opacity: '0.8',
    },
    dangerZone: {
      backgroundColor: '#fff3f3',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '30px',
      border: '2px solid #ff4444',
    },
    dangerTitle: {
      color: '#ff4444',
      marginBottom: '15px',
      textAlign: 'center',
    },
    viewToggle: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px',
    }
  };

  if (loading && goals.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🎯 Goal Tracker</h1>
        </div>
        <div style={styles.loadingMessage}>
          <h2>Caricamento obiettivi...</h2>
          <p>Connessione al database...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Goal Tracker</h1>
        <p style={styles.subtitle}>Traccia i tuoi obiettivi quotidiani</p>
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
              backgroundColor: 'white',
              color: '#ff4444',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Riprova
          </button>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, ...styles.addButton}}
          onClick={() => setShowAddGoal(!showAddGoal)}
        >
          {showAddGoal ? '✕ Chiudi' : '➕ Nuovo Obiettivo'}
        </button>
        
        <button 
          style={{...styles.button, ...styles.checkButton}}
          onClick={() => setShowDailyCheck(!showDailyCheck)}
        >
          {showDailyCheck ? '✕ Chiudi' : '✓ Check Giornaliero'}
        </button>

        <button 
          style={{...styles.button, ...styles.progressButton}}
          onClick={() => setViewMode('progress')}
        >
          📊 Vista Progressi
        </button>

        <button 
          style={{...styles.button, ...styles.calendarButton}}
          onClick={() => setViewMode('calendar')}
        >
          📅 Vista Calendario
        </button>

        <button 
          style={{...styles.button, ...styles.deleteAllButton}}
          onClick={() => setShowDeleteAll(!showDeleteAll)}
        >
          {showDeleteAll ? '✕ Annulla' : '🗑️ Elimina Tutto'}
        </button>
      </div>

      {showDeleteAll && (
        <div style={styles.dangerZone}>
          <h3 style={styles.dangerTitle}>⚠️ ZONA PERICOLOSA</h3>
          <p style={{textAlign: 'center', marginBottom: '20px', color: '#666'}}>
            Stai per eliminare tutti gli obiettivi. Questa azione non può essere annullata!
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
            <button 
              style={{...styles.button, ...styles.deleteAllButton}}
              onClick={deleteAllGoals}
            >
              Conferma Eliminazione Totale
            </button>
            <button 
              style={{...styles.button, backgroundColor: '#666', color: 'white'}}
              onClick={() => setShowDeleteAll(false)}
            >
              Annulla
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
        <p>💾 Dati sincronizzati con il database cloud</p>
        <p>Obiettivi totali: {goals.length}</p>
      </div>
    </div>
  );
}

export default App;