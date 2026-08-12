import React, { useState, useEffect } from 'react';
import GoalForm from './components/GoalForm';
import DailyCheck from './components/DailyCheck';
import ProgressBars from './components/ProgressBars';

function App() {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showDailyCheck, setShowDailyCheck] = useState(false);

  // Carica gli obiettivi dal localStorage all'avvio
  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    
    // Controlla se è mezzanotte e resetta i check giornalieri
    checkMidnight();
  }, []);

  // Salva gli obiettivi nel localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const checkMidnight = () => {
    const lastCheck = localStorage.getItem('lastMidnightCheck');
    const today = new Date().toDateString();
    
    if (lastCheck !== today) {
      // È un nuovo giorno, sposta i check giornalieri nella cronologia
      setGoals(prevGoals => 
        prevGoals.map(goal => ({
          ...goal,
          checkedToday: false,
          dailyHistory: goal.checkedToday 
            ? [...(goal.dailyHistory || []), new Date().toDateString()]
            : goal.dailyHistory || []
        }))
      );
      localStorage.setItem('lastMidnightCheck', today);
    }
  };

  const addGoal = (newGoal) => {
    const goal = {
      id: Date.now(),
      name: newGoal.name,
      duration: parseInt(newGoal.duration),
      startDate: new Date().toISOString(),
      dailyHistory: [],
      checkedToday: false
    };
    setGoals([...goals, goal]);
    setShowAddGoal(false);
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const toggleTodayCheck = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, checkedToday: !goal.checkedToday }
        : goal
    ));
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
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
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Goal Tracker</h1>
        <p>Traccia i tuoi obiettivi quotidiani</p>
      </div>

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
    </div>
  );
}

export default App;