// Smart AI Campus Concierge - Interactive Navigation Map

class CampusMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.nodes = window.db.data.navigationNodes;
    this.edges = window.db.data.navigationEdges;
    this.buildings = window.db.data.buildings;
    
    this.selectedStart = null;
    this.selectedEnd = null;
    this.currentPath = null; // List of node IDs
    this.wheelchairAccess = false;
    
    // Animation states
    this.animationOffset = 0;
    this.pulseRadius = 0;
    this.animationFrameId = null;
    
    // Canvas Pan & Zoom
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.setupListeners();
    this.resizeCanvas();
    this.startAnimation();
  }

  resizeCanvas() {
    const rect = this.canvas.parentNode.getBoundingClientRect();
    this.canvas.width = rect.width || 800;
    this.canvas.height = rect.height || 500;
    this.draw();
  }

  setupListeners() {
    window.addEventListener("resize", () => this.resizeCanvas());
    
    // Handle tap / click
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - this.offsetX) / this.scale;
      const clickY = (e.clientY - rect.top - this.offsetY) / this.scale;
      
      // Check if clicked a building node
      const clickedBuildingNode = this.nodes.find(n => {
        if (!n.isBuilding) return false;
        const dx = n.x - clickX;
        const dy = n.y - clickY;
        return Math.sqrt(dx * dx + dy * dy) < 25; // Tap radius
      });
      
      if (clickedBuildingNode) {
        const buildingId = clickedBuildingNode.id.replace("node_", "");
        this.handleBuildingClick(buildingId);
      }
    });
  }

  handleBuildingClick(buildingId) {
    // If there is an external listener, call it
    if (window.onMapBuildingSelected) {
      window.onMapBuildingSelected(buildingId);
    }
  }

  startAnimation() {
    const animate = () => {
      this.animationOffset += 0.5;
      if (this.animationOffset > 20) this.animationOffset = 0;
      
      this.pulseRadius += 0.15;
      if (this.pulseRadius > 12) this.pulseRadius = 0;
      
      this.draw();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  setAccessibility(enabled) {
    this.wheelchairAccess = enabled;
    this.calculateRoute();
  }

  setStart(buildingId) {
    this.selectedStart = buildingId ? "node_" + buildingId : null;
    this.calculateRoute();
  }

  setEnd(buildingId) {
    this.selectedEnd = buildingId ? "node_" + buildingId : null;
    this.calculateRoute();
  }

  clearRoute() {
    this.selectedStart = null;
    this.selectedEnd = null;
    this.currentPath = null;
    this.draw();
  }

  // Dijkstra shortest path algorithm
  calculateRoute() {
    if (!this.selectedStart || !this.selectedEnd) {
      this.currentPath = null;
      return;
    }
    
    const start = this.selectedStart;
    const end = this.selectedEnd;
    
    const distances = {};
    const previous = {};
    let queue = [];
    
    this.nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      queue.push(node.id);
    });
    distances[start] = 0;
    
    // Helper to get edges connected to node
    const getNeighbors = (nodeId) => {
      const neighbors = [];
      this.edges.forEach(edge => {
        if (this.wheelchairAccess && !edge.accessible) return;
        
        if (edge.from === nodeId) {
          neighbors.push({ to: edge.to, distance: edge.distance });
        } else if (edge.to === nodeId) {
          neighbors.push({ to: edge.from, distance: edge.distance });
        }
      });
      return neighbors;
    };
    
    while (queue.length > 0) {
      // Find node in queue with minimum distance
      queue.sort((a, b) => distances[a] - distances[b]);
      const current = queue.shift();
      
      if (current === end) break;
      if (distances[current] === Infinity) break;
      
      const neighbors = getNeighbors(current);
      neighbors.forEach(neighbor => {
        if (!queue.includes(neighbor.to)) return;
        const alt = distances[current] + neighbor.distance;
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = current;
        }
      });
    }
    
    // Backtrack path
    const path = [];
    let curr = end;
    if (previous[curr] !== null || curr === start) {
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
    }
    
    this.currentPath = path.length > 1 ? path : null;
    
    // Trigger callback if route generated
    if (this.currentPath && window.onRouteCalculated) {
      const totalDist = distances[end];
      const timeMin = Math.round(totalDist / 80); // walking 80m/min
      window.onRouteCalculated({
        distance: totalDist,
        time: timeMin || 1,
        path: this.currentPath.map(nodeId => {
          const node = this.nodes.find(n => n.id === nodeId);
          return node ? node.name : "";
        })
      });
    }
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
    
    // Draw stylized background grid lines
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < 900; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, 600);
      this.ctx.stroke();
    }
    for (let y = 0; y < 600; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(900, y);
      this.ctx.stroke();
    }
    
    // Draw all standard edges (paths)
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.lineWidth = 4;
    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.stroke();
        
        // Draw wheelchair icon/dot helper if accessible
        if (edge.accessible) {
          this.ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
          this.ctx.beginPath();
          this.ctx.arc((fromNode.x + toNode.x)/2, (fromNode.y + toNode.y)/2, 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    });
    
    // Draw current active path overlay with animation
    if (this.currentPath) {
      this.ctx.strokeStyle = "#5c59e7"; // Indigo path glow
      this.ctx.lineWidth = 6;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "rgba(92, 89, 231, 0.3)";
      this.ctx.setLineDash([12, 6]);
      this.ctx.lineDashOffset = -this.animationOffset;
      
      this.ctx.beginPath();
      for (let i = 0; i < this.currentPath.length; i++) {
        const node = this.nodes.find(n => n.id === this.currentPath[i]);
        if (i === 0) {
          this.ctx.moveTo(node.x, node.y);
        } else {
          this.ctx.lineTo(node.x, node.y);
        }
      }
      this.ctx.stroke();
      
      // Reset line dashes & shadows
      this.ctx.setLineDash([]);
      this.ctx.shadowBlur = 0;
      
      // Draw walking pulse
      const startNode = this.nodes.find(n => n.id === this.selectedStart);
      if (startNode) {
        this.ctx.fillStyle = "rgba(92, 89, 231, 0.3)";
        this.ctx.beginPath();
        this.ctx.arc(startNode.x, startNode.y, 8 + this.pulseRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    // Draw junctions/path points (non-buildings)
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    this.nodes.forEach(node => {
      if (!node.isBuilding) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    // Draw buildings with beautiful styled shapes
    this.nodes.forEach(node => {
      if (node.isBuilding) {
        const bId = node.id.replace("node_", "");
        const building = this.buildings.find(b => b.id === bId);
        if (!building) return;
        
        const isStart = node.id === this.selectedStart;
        const isEnd = node.id === this.selectedEnd;
        
        // Highlight states
        let fillStyle = "#ffffff";
        let strokeStyle = "rgba(92, 89, 231, 0.15)";
        let textStyle = "#0f172a";
        let glow = 0;
        
        if (isStart) {
          fillStyle = "rgba(92, 89, 231, 0.95)";
          strokeStyle = "#4338ca";
          textStyle = "#ffffff";
          glow = 10;
        } else if (isEnd) {
          fillStyle = "rgba(239, 68, 68, 0.95)";
          strokeStyle = "#dc2626";
          textStyle = "#ffffff";
          glow = 10;
        }
        
        // Shadow glow
        if (glow > 0) {
          this.ctx.shadowBlur = glow;
          this.ctx.shadowColor = strokeStyle;
        }
        
        // Draw building body capsule
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.lineWidth = 2;
        
        const w = 120;
        const h = 44;
        const bx = node.x - w / 2;
        const by = node.y - h / 2;
        const radius = 10;
        
        this.ctx.beginPath();
        this.ctx.moveTo(bx + radius, by);
        this.ctx.lineTo(bx + w - radius, by);
        this.ctx.quadraticCurveTo(bx + w, by, bx + w, by + radius);
        this.ctx.lineTo(bx + w, by + h - radius);
        this.ctx.quadraticCurveTo(bx + w, by + h, bx + w - radius, by + h);
        this.ctx.lineTo(bx + radius, by + h);
        this.ctx.quadraticCurveTo(bx, by + h, bx, by + h - radius);
        this.ctx.lineTo(bx, by + radius);
        this.ctx.quadraticCurveTo(bx, by, bx + radius, by);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0; // reset shadow
        
        // Draw building code badge
        this.ctx.fillStyle = isStart || isEnd ? "rgba(255, 255, 255, 0.25)" : "rgba(92, 89, 231, 0.08)";
        this.ctx.beginPath();
        this.ctx.arc(node.x - 40, node.y, 11, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.font = "bold 9px sans-serif";
        this.ctx.fillStyle = isStart || isEnd ? "#ffffff" : "#5c59e7";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(building.code, node.x - 40, node.y);
        
        // Draw building name
        this.ctx.font = "bold 11px sans-serif";
        this.ctx.fillStyle = textStyle;
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        
        // Split text if too long
        let displayTitle = building.name.replace(" & Food Court", "").replace(" & Medical Center", "");
        if (displayTitle.length > 15) {
          displayTitle = displayTitle.substring(0, 13) + "..";
        }
        this.ctx.fillText(displayTitle, node.x - 22, node.y);
      }
    });
    
    this.ctx.restore();
  }
}

// Attach globally
window.CampusMap = CampusMap;
