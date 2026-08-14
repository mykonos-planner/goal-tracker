import React, { useState, useEffect, useRef } from 'react';

function NetworkGraph({ people, connections }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    
    const initialNodes = [
      { 
        id: 'me', 
        x: centerX, 
        y: centerY, 
        label: 'ME', 
        type: 'me', 
        color: '#00ff00',
        radius: 30,
        pulse: 0,
      },
      ...people.map((person, index) => {
        const angle = (index / people.length) * 2 * Math.PI;
        const radius = 180;
        return {
          id: person.id,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          label: `${person.name} ${person.surname}`,
          type: person.relationship,
          color: getRelationshipColor(person.relationship),
          radius: 20,
          pulse: Math.random() * Math.PI * 2,
        };
      }),
    ];
    
    setNodes(initialNodes);
  }, [people, canvasSize]);

  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
    };
    
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case 'close_friend': return '#00ff00';
      case 'important_friend': return '#00ff88';
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
    
    drawGrid(ctx);
    
    connections.forEach((connection, index) => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (fromNode && toNode) {
        drawNeuralConnection(ctx, fromNode, toNode, connection.type, index);
      }
    });
    
    const meNode = nodes.find(n => n.id === 'me');
    if (meNode) {
      nodes.filter(n => n.id !== 'me').forEach((node, index) => {
        const connectionType = node.type;
        drawNeuralConnection(ctx, meNode, node, connectionType, index + 1000);
      });
    }
    
    nodes.forEach(node => {
      drawNode(ctx, node);
    });
    
    drawParticles(ctx);
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvasSize.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvasSize.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
  };

  const drawNeuralConnection = (ctx, fromNode, toNode, type, index) => {
    const color = getRelationshipColor(type);
    
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = `${color}88`;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();
    
    const numPoints = 5;
    for (let i = 1; i < numPoints; i++) {
      const t = i / numPoints;
      const x = fromNode.x + (toNode.x - fromNode.x) * t;
      const y = fromNode.y + (toNode.y - fromNode.y) * t;
      
      const pulseOffset = Math.sin(animationFrame * 0.05 + index) * 3;
      
      ctx.beginPath();
      ctx.arc(x + pulseOffset, y + pulseOffset, 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 5;
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
  };

  const drawNode = (ctx, node) => {
    const pulseIntensity = Math.sin(animationFrame * 0.03 + node.pulse) * 0.3 + 0.7;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = `${node.color}33`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
    gradient.addColorStop(0, node.color);
    gradient.addColorStop(1, `${node.color}66`);
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.shadowColor = node.color;
    ctx.shadowBlur = 20 * pulseIntensity;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * pulseIntensity, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = node.type === 'me' ? 'bold 14px Courier New' : '11px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(node.label, node.x, node.y - node.radius - 15);
  };

  const drawParticles = (ctx) => {
    const numParticles = 20;
    
    for (let i = 0; i < numParticles; i++) {
      const x = (Math.sin(animationFrame * 0.01 + i * 2) * 0.5 + 0.5) * canvasSize.width;
      const y = (Math.cos(animationFrame * 0.015 + i * 3) * 0.5 + 0.5) * canvasSize.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fill();
    }
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, connections, animationFrame, hoveredNode]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance < node.radius + 10;
    });
    
    if (clickedNode) {
      setDraggedNode(clickedNode.id);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (draggedNode) {
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggedNode
            ? { ...node, x, y }
            : node
        )
      );
    } else {
      const hovered = nodes.find(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        return distance < node.radius + 10;
      });
      setHoveredNode(hovered ? hovered.id : null);
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const styles = {
    container: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid #00ff00',
      position: 'relative',
      boxSizing: 'border-box',
      boxShadow: '0 0 30px rgba(0, 255, 0, 0.2)',
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
      letterSpacing: '1px',
    },
    legendDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      display: 'inline-block',
      boxShadow: '0 0 10px currentColor',
    },
    infoPanel: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      padding: '10px',
      color: '#00ff00',
      fontSize: '10px',
      letterSpacing: '1px',
    },
  };

  const hoveredPerson = hoveredNode ? nodes.find(n => n.id === hoveredNode) : null;

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
      
      {hoveredPerson && (
        <div style={styles.infoPanel}>
          <div style={{fontWeight: 'bold', marginBottom: '5px'}}>
            {hoveredPerson.label}
          </div>
          <div style={{color: hoveredPerson.color}}>
            [{hoveredPerson.type.toUpperCase()}]
          </div>
        </div>
      )}
      
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#00ff00', color: '#00ff00'}} />
          Amico Stretto
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#00ff88', color: '#00ff88'}} />
          Amico Importante
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#00ccff', color: '#00ccff'}} />
          Amico
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#ff9900', color: '#ff9900'}} />
          Conoscente
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendDot, backgroundColor: '#ff4444', color: '#ff4444'}} />
          Nemico
        </div>
      </div>
    </div>
  );
}

export default NetworkGraph;