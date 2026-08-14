import React, { useState, useEffect, useRef } from 'react';

function NetworkGraph({ people, connections, groups, onDeleteGroup, onUpdateGroup, onEditGroup }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 1000 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [groupLabelPositions, setGroupLabelPositions] = useState({});
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [touchDistance, setTouchDistance] = useState(null);

  useEffect(() => {
    const savedPositions = localStorage.getItem('nodePositions');
    if (savedPositions) {
      setNodePositions(JSON.parse(savedPositions));
    }
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCanvasSize({ width: 800, height: 600 });
      } else {
        setCanvasSize({ width: 1600, height: 1000 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('nodePositions', JSON.stringify(nodePositions));
  }, [nodePositions]);

  useEffect(() => {
    const centerX = 800;
    const centerY = 500;
    
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
        const radius = 350;
        return {
          id: person.id,
          x: savedPosition?.x || centerX + radius * Math.cos(angle),
          y: savedPosition?.y || centerY + radius * Math.sin(angle),
          label: person.name + ' ' + person.surname,
          type: person.relationship,
          color: getRelationshipColor(person.relationship),
          radius: 25,
          pulse: Math.random() * Math.PI * 2,
          personData: person,
        };
      }),
    ];
    
    setNodes(initialNodes);
  }, [people, nodePositions]);

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
      return Math.max(0.3, Math.min(1.5, newZoom));
    });
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
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
    const labelY = centerY - maxRadius - 20;
    
    setGroupLabelPositions(prev => ({
      ...prev,
      [group.id]: { x: labelX, y: labelY }
    }));
    
    const fontSize = Math.max(12, 16 / zoomLevel);
    ctx.font = 'bold ' + fontSize + 'px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textWidth = ctx.measureText(group.name).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(labelX - textWidth/2 - 8, labelY - fontSize/2 - 6, textWidth + 16, fontSize + 12);
    
    ctx.fillStyle = isSelected ? '#ffffff' : '#00ccff';
    ctx.fillText(group.name, labelX, labelY);
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.03)';
    ctx.lineWidth = 1;
    
    const gridWidth = 1600;
    const gridHeight = 1000;
    
    for (let x = 0; x < gridWidth; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gridHeight);
      ctx.stroke();
    }
    
    for (let y = 0; y < gridHeight; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(gridWidth, y);
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
    ctx.strokeStyle = color + '88';
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
    ctx.strokeStyle = isSelected ? '#ffffff' : node.color + '33';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();
    
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
    gradient.addColorStop(0, node.color);
    gradient.addColorStop(1, node.color + '66');
    
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
    
    const fontSize = Math.max(10, (node.type === 'me' ? 18 : 14) / zoomLevel);
    ctx.font = (node.type === 'me' ? 'bold ' : '') + fontSize + 'px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textWidth = ctx.measureText(node.label).width;
    const textY = node.y - node.radius - 20;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(node.x - textWidth/2 - 8, textY - fontSize/2 - 6, textWidth + 16, fontSize + 12);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(node.label, node.x, textY);
  };

  const drawParticles = (ctx) => {
    const numParticles = isMobile ? 15 : 30;
    
    for (let i = 0; i < numParticles; i++) {
      const x = (Math.sin(animationFrame * 0.01 + i * 2) * 0.5 + 0.5) * 1600;
      const y = (Math.cos(animationFrame * 0.015 + i * 3) * 0.5 + 0.5) * 1000;
      
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fill();
    }
  };

  useEffect(() => {
    drawGraph();
  }, [nodes, connections, animationFrame, hoveredNode, groups, selectedNode, selectedGroup, draggedNode, zoomLevel, panOffset, isMobile]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    
    for (const group of groups) {
      const labelPos = groupLabelPositions[group.id];
      if (labelPos) {
        const adjustedX = labelPos.x * zoomLevel + panOffset.x;
        const adjustedY = labelPos.y * zoomLevel + panOffset.y;
        const distance = Math.sqrt((adjustedX - x) ** 2 + (adjustedY - y) ** 2);
        if (distance < 30 * zoomLevel) {
          setSelectedGroup(group.id);
          setShowGroupPanel(true);
          setEditingGroup(group);
          setSelectedNode(null);
          setDraggedNode(null);
          return;
        }
      }
    }
    
    for (const node of nodes) {
      const adjustedX = node.x * zoomLevel + panOffset.x;
      const adjustedY = node.y * zoomLevel + panOffset.y;
      const adjustedRadius = node.radius * zoomLevel;
      const distance = Math.sqrt((adjustedX - x) ** 2 + (adjustedY - y) ** 2);
      if (distance <= adjustedRadius + 5) {
        setDraggedNode(node.id);
        setSelectedNode(node.id);
        setSelectedGroup(null);
        setShowGroupPanel(false);
        return;
      }
    }
    
    setIsPanning(true);
    setPanStart({ 
      x: (e.touches ? e.touches[0].clientX : e.clientX) - panOffset.x, 
      y: (e.touches ? e.touches[0].clientY : e.clientY) - panOffset.y 
    });
    setSelectedGroup(null);
    setShowGroupPanel(false);
    setSelectedNode(null);
    setDraggedNode(null);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    
    if (draggedNode) {
      const { x, y } = getCoordinates(e);
      const worldX = (x - panOffset.x) / zoomLevel;
      const worldY = (y - panOffset.y) / zoomLevel;
      handleNodeDrag(draggedNode, worldX, worldY);
    } else if (isPanning) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPanOffset({
        x: clientX - panStart.x,
        y: clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
        (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      setTouchDistance(distance);
    } else {
      handleMouseDown(e);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
        (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      
      if (touchDistance) {
        const scale = distance / touchDistance;
        if (scale > 1.1) {
          handleZoom(0.05);
          setTouchDistance(distance);
        } else if (scale < 0.9) {
          handleZoom(-0.05);
          setTouchDistance(distance);
        }
      }
    } else {
      handleMouseMove(e);
    }
  };

  const styles = {
    container: {
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '8px',
      padding: isMobile ? '10px' : '20px',
      border: '1px solid #00ff00',
      position: 'relative',
      boxSizing: 'border-box',
      boxShadow: '0 0 30px rgba(0, 255, 0, 0.2)',
      overflow: 'hidden',
    },
    canvas: {
      width: '100%',
      height: 'auto',
      cursor: draggedNode ? 'grabbing' : isPanning ? 'grabbing' : 'grab',
      display: 'block',
      backgroundColor: '#0a0a0a',
      borderRadius: '4px',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      maxWidth: '100%',
      touchAction: 'none',
    },
    zoomControls: {
      position: 'absolute',
      bottom: isMobile ? '50px' : '70px',
      right: isMobile ? '15px' : '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      zIndex: 15,
    },
    zoomButton: {
      width: isMobile ? '40px' : '35px',
      height: isMobile ? '40px' : '35px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid #00ff00',
      borderRadius: '4px',
      color: '#00ff00',
      fontSize: isMobile ? '20px' : '18px',
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
      gap: isMobile ? '8px' : '15px',
      marginTop: '15px',
      flexWrap: 'wrap',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#00ff00',
      fontSize: isMobile ? '9px' : '11px',
      letterSpacing: '1px',
    },
    legendDot: {
      width: isMobile ? '8px' : '10px',
      height: isMobile ? '8px' : '10px',
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
      bottom: isMobile ? '10px' : '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      padding: isMobile ? '10px' : '15px',
      color: '#00ccff',
      fontSize: isMobile ? '10px' : '11px',
      letterSpacing: '1px',
      zIndex: 20,
      minWidth: isMobile ? '200px' : '250px',
      boxShadow: '0 0 20px rgba(0, 204, 255, 0.3)',
    },
    groupPanelTitle: {
      color: '#00ccff',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: 'bold',
      marginBottom: '10px',
      textAlign: 'center',
    },
    groupPanelButtons: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginTop: '10px',
      flexWrap: 'wrap',
    },
    groupPanelButton: {
      padding: isMobile ? '8px 12px' : '8px 15px',
      border: '1px solid #00ccff',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#00ccff',
      fontSize: isMobile ? '9px' : '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
    },
    deleteGroupButton: {
      padding: isMobile ? '8px 12px' : '8px 15px',
      border: '1px solid #ff4444',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#ff4444',
      fontSize: isMobile ? '9px' : '10px',
      letterSpacing: '1px',
      fontFamily: "'Courier New', monospace",
      transition: 'all 0.3s',
    },
    backButton: {
      padding: isMobile ? '8px 12px' : '8px 15px',
      border: '1px solid #666',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: '#666',
      fontSize: isMobile ? '9px' : '10px',
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />
      
      <div style={styles.zoomControls}>
        <button 
          style={styles.zoomButton}
          onClick={() => handleZoom(0.1)}
        >
          +
        </button>
        <button 
          style={styles.zoomButton}
          onClick={() => handleZoom(-0.1)}
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
            >
              [ EDIT ]
            </button>
            <button 
              style={styles.deleteGroupButton}
              onClick={() => onDeleteGroup(editingGroup.id)}
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