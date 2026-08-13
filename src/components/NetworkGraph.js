import React, { useState, useEffect, useRef } from 'react';

function NetworkGraph({ people, connections }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Inizializza i nodi con posizioni casuali
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    
    const initialNodes = [
      { id: 'me', x: centerX, y: centerY, label: 'ME', type: 'me', color: '#00ff00' },
      ...people.map((person, index) => {
        const angle = (index / people.length) * 2 * Math.PI;
        const radius = 150;
        return {
          id: person.id,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          label: `${person.name} ${person.surname}`,
          type: person.relationship,
          color: getRelationshipColor(person.relationship),
        };
      }),
    ];
    
    setNodes(initialNodes);
  }, [people, canvasSize]);

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'close_friend': return '#00ff00';
      case 'friend': return '#00ccff';
      case 'acquaintance': return '#ff9900';
      case 'enemy': return '#ff4444';
      default: return '#00ff00';
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Disegna le connessioni
    connections.forEach(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = getRelationshipColor(connection.type);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
    // Disegna i nodi
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.type === 'me' ? 25 : 20, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Etichetta
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y - 30);
    });
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, connections]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance < 25;
    });
    
    if (clickedNode) {
      setDraggedNode(clickedNode.id);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggedNode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggedNode
          ? { ...node, x, y }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const styles = {
    container: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid #00ff00',
      position: 'relative',
      boxSizing: 'border-box',
    },
    canvas: {
      width: '100%',
      height: '100%',
      cursor: draggedNode ? 'grabbing' : 'grab',
      display: 'block',
      backgroundColor: '#0a0a0a',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
    },
    legend: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginTop: '15px',
      flexWrap: 'wrap',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#00ff00',
      fontSize: '11px',
    },
    legendDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.container}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#00ff00'}} />
          Amico Stretto
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#00ccff'}} />
          Amico
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#ff9900'}} />
          Conoscente
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#ff4444'}} />
          Nemico
        </div>
      </div>
    </div>
  );
}

export default NetworkGraph;