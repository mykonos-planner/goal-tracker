import React, { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm';
import DailyCheck from './components/DailyCheck';
import ProgressBars from './components/ProgressBars';

function App() {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showDailyCheck, setShowDailyCheck] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Carica gli obiettivi dal database all'avvio
  useEffect(() => {
    fetchGoals();
    
    // Aggiorna automaticamente ogni 30 secondi
    const interval = setInterval(() => {
      fetchGoals();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add goal');
      }
      
      const createdGoal = await response.json();
      
      // Aggiorna lo stato locale
      setGoals(prevGoals => [createdGoal, ...prevGoals]);
      setShowAddGoal(false);
      setError(null);
      
      // Ricarica gli obiettivi dal server per sincronizzare
      await fetchGoals();
      
      return true;
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Errore nell\'aggiunta dell\'obiettivo');
      alert('Errore nell\'aggiunta dell\'obiettivo. Riprova.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete goal');
      
      // Aggiorna lo stato locale
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      setError(null);
      
      // Ricarica dal server
      await fetchGoals();
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Errore nell\'eliminazione dell\'obiettivo');
      alert('Errore nell\'eliminazione dell\'obiettivo');
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
      
      if (!response.ok) throw new Error('Failed to update check');
      
      const updatedGoal = await response.json();
      
      // Aggiorna lo stato locale
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === goalId ? updatedGoal : goal
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating check:', err);
      setError('Errore nell\'aggiornamento del check');
      alert('Errore nell\'aggiornamento del check');
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
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
    refreshButton: {
      backgroundColor: '#FF9800',
      color: 'white',
      padding: '8px 16px',
      fontSize: '14px',
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
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {showAddGoal ? '✕ Chiudi' : '➕ Nuovo Obiettivo'}
        </button>
        
        <button 
          style={{...styles.button, ...styles.checkButton}}
          onClick={() => setShowDailyCheck(!showDailyCheck)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {showDailyCheck ? '✕ Chiudi' : '✓ Check Giornaliero'}
        </button>

        <button 
          style={{...styles.button, ...styles.refreshButton}}
          onClick={() => fetchGoals()}
          title="Aggiorna dal server"
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🔄 Aggiorna
        </button>
      </div>

      {showAddGoal && <GoalForm onAddGoal={addGoal} />}
      {showDailyCheck && (
        <DailyCheck 
          goals={goals} 
          onToggleCheck={toggleTodayCheck} 
        />
      )}
      
      <ProgressBars 
        goals={goals} 
        onDeleteGoal={deleteGoal}
      />

      <div style={styles.syncStatus}>
        <p>💾 Dati sincronizzati con il database cloud</p>
        <p>Ultimo aggiornamento: {new Date(lastUpdate).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default App;