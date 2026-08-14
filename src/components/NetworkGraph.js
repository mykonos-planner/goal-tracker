import React, { useState, useEffect, useRef } from 'react';

function NetworkGraph({ people, connections, groups, onDeleteGroup, onUpdateGroup, onEditGroup }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 700 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [groupLabelPositions, setGroupLabelPositions] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const savedPositions = localStorage.getItem('nodePositions');
    if (savedPositions) {
      setNodePositions(JSON.parse(savedPositions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nodePositions', JSON.stringify(nodePositions));
  }, [nodePositions]);

  useEffect(() => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    
    const initialNodes = [
      { 
        id: 'me', 
        x: nodePositions['me']?.x || centerX, 
        y: nodePositions['me']?.y || centerY, 
        label: 'ME', 
        type: 'me', 
        color: '#00ff00',
        radius: 30,
        pulse: 0,
      },
      ...people.map((person, index) => {
        const savedPosition = nodePositions[person.id];
        const angle = (index / people.length) * 2 * Math.PI;
        const radius = 250;
        return {
          id: person.id,
          x: savedPosition?.x || centerX + radius * Math.cos(angle),
          y: savedPosition?.y || centerY + radius * Math.sin(angle),
          label: `${person.name} ${person.surname}`,
          type: person.relationship,
          color: getRelationshipColor(person.relationship),
          radius: 20,
          pulse: Math.random() * Math.PI * 2,
          personData: person,
        };
      }),
    ];
    
    setNodes(initialNodes);
  }, [people, canvasSize, nodePositions]);

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

  const handleNodeDrag = (nodeId, x, y) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, x, y }
          : node
      )
    );
    
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: { x, y }
    }));
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => {
      const newZoom = prev + delta;
      return Math.max(0.5, Math.min(2, newZoom));
    });
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Applica zoom
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomLevel, zoomLevel);
    
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
        drawNeuralConnection(ctx, meNode, node, node.type, index + 1000);
      });
    }
    
    groups.forEach(group => {
      drawGroupCircle(ctx, group);
    });
    
    nodes.forEach(node => {
      drawNode(ctx, node);
    });
    
    drawParticles(ctx);
    
    ctx.restore();
  };

  const drawGroupCircle = (ctx, group) => {
    const groupNodes = nodes.filter(node => 
      group.people.includes(node.id) || 
      (group.includeMe && node.id === 'me')
    );
    
    if (groupNodes.length < 2) return;
    
    const centerX = groupNodes.reduce((sum, node) => sum + node.x, 0) / groupNodes.length;
    const centerY = groupNodes.reduce((sum, node) => sum + node.y, 0) / groupNodes.length;
    
    const maxRadius = Math.max(...groupNodes.map(node => {
      const distance = Math.sqrt((node.x - centerX) ** 2 + (node.y - centerY) ** 2);
      return distance + node.radius + 20;
    }));
    
    const isSelected = selectedGroup === group.id;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? '#00ccff' : 'rgba(0, 204, 255, 0.5)';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.setLineDash(isSelected ? [] : [5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(0, 204, 255, 0.1)';
      ctx.fill();
    }
    
    const labelX = centerX;
    const labelY = centerY - maxRadius - 15;
    
    setGroupLabelPositions(prev => ({
      ...prev,
      [group.id]: { x: labelX, y: labelY }
    }));
    
    ctx.fillStyle = isSelected ? '#ffffff' : '#00ccff';
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(group.name, labelX, labelY);
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
    const isSelected = selectedNode === node.id;
    const isDragged = draggedNode === node.id;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? '#ffffff' : `${node.color}33`;
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();
    
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
    gradient.addColorStop(0, node.color);
    gradient.addColorStop(1, `${node.color}66`);
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.shadowColor = node.color;
    ctx.shadowBlur = isDragged ? 30 : 20 * pulseIntensity;
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
  }, [nodes, connections, animationFrame, hoveredNode, groups, selectedNode, selectedGroup, draggedNode, zoomLevel, panOffset]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Controlla click sul nome del gruppo
    for (const group of groups) {
      const labelPos = groupLabelPositions[group.id];
      if (labelPos) {
        const distance = Math.sqrt((labelPos.x - x) ** 2 + (labelPos.y - y) ** 2);
        if (distance < 30) {
          setSelectedGroup(group.id);
          setShowGroupPanel(true);
          setEditingGroup(group);
          setSelectedNode(null);
          setDraggedNode(null);
          return;
        }
      }
    }
    
    // Controlla click sul pallino
    for (const node of nodes) {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      if (distance <= node.radius + 5) {
        setDraggedNode(node.id);
        setSelectedNode(node.id);
        setSelectedGroup(null);
        setShowGroupPanel(false);
        return;
      }
    }
    
    setSelectedGroup(null);
    setShowGroupPanel(false);
    setSelectedNode(null);
    setDraggedNode(null);
  };

  const handleMouseMove = (e) => {
    if (!draggedNode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    handleNodeDrag(draggedNode, x, y);
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta);
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
      overflow: 'hidden',
    },
    canvas: {
      width: '100%',
      height: 'auto',
      cursor: draggedNode ? 'grabbing' : 'default',
      display: 'block',
      backgroundColor: '#0a0a0a',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      maxWidth: '100%',
    },
    zoomControls: {
      position: 'absolute',
      bottom: '60px',
      right: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      zIndex: 15,
    },
    zoomButton: {
      width: '35px',
      height: '35px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      color: '#00ff00',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
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
      zIndex: 10,
    },
    groupPanel: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      padding: '15px',
      color: '#00ccff',
      fontSize: '11px',
      letterSpacing: '1px',
      zIndex: 20,
      minWidth: '250px',
      boxShadow: '0 0 20px rgba(0, 204, 255, 0.3)',
    },
    groupPanelTitle: {
      color: '#00ccff',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
    },
    groupPanelButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '10px',
      flexWrap: 'wrap',
    },
    groupPanelButton: {
      padding: '8px 15px',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#00ccff',
      fontSize: '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
    },
    deleteGroupButton: {
      padding: '8px 15px',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#ff4444',
      fontSize: '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
    },
    backButton: {
      padding: '8px 15px',
      border: '1px solid #666',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#666',
      fontSize: '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
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
        onWheel={handleWheel}
      />
      
      <div style={styles.zoomControls}>
        <button 
          style={styles.zoomButton}
          onClick={() => handleZoom(0.1)}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'}
        >
          +
        </button>
        <button 
          style={styles.zoomButton}
          onClick={() => handleZoom(-0.1)}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'}
        >
          -
        </button>
      </div>
      
      {showGroupPanel && editingGroup && (
        <div style={styles.groupPanel}>
          <div style={styles.groupPanelTitle}>
            [ {editingGroup.name} ]
          </div>
          <div style={{marginBottom: '10px', textAlign: 'center'}}>
            Members: {editingGroup.people.length + (editingGroup.includeMe ? 1 : 0)}
          </div>
          <div style={styles.groupPanelButtons}>
            <button 
              style={styles.groupPanelButton}
              onClick={() => {
                onEditGroup(editingGroup);
                setShowGroupPanel(false);
                setSelectedGroup(null);
                setEditingGroup(null);
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 204, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              [ EDIT ]
            </button>
            <button 
              style={styles.deleteGroupButton}
              onClick={() => onDeleteGroup(editingGroup.id)}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              [ DELETE ]
            </button>
            <button 
              style={styles.backButton}
              onClick={() => {
                setShowGroupPanel(false);
                setSelectedGroup(null);
                setEditingGroup(null);
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(102, 102, 102, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              [ BACK ]
            </button>
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