// Smart AI Campus Concierge - Analytics Visualizer (SVG Graphs)

class CampusAnalytics {
  constructor() {
    this.analytics = window.db.getAnalytics();
  }

  renderDashboard() {
    this.analytics = window.db.getAnalytics();
    
    // Draw counters
    document.getElementById("stat-sessions-val").innerText = this.analytics.kioskSessions.toLocaleString();
    document.getElementById("stat-avgtime-val").innerText = `${Math.floor(this.analytics.averageSessionTimeSec / 60)}m ${this.analytics.averageSessionTimeSec % 60}s`;
    
    this.drawDailyVisitorsChart();
    this.drawPopularDestinationsChart();
    this.drawLanguageMetrics();
    this.drawFrequentQueries();
  }

  drawDailyVisitorsChart() {
    const container = document.getElementById("analytics-line-chart");
    if (!container) return;
    
    const data = this.analytics.dailyVisitors;
    const width = 450;
    const height = 180;
    const padding = 30;
    
    const maxVal = Math.max(...data.map(d => d.count)) * 1.15;
    
    // Generate SVG path coordinates
    const points = data.map((d, index) => {
      const x = padding + (index * (width - padding * 2) / (data.length - 1));
      const y = height - padding - (d.count * (height - padding * 2) / maxVal);
      return { x, y, label: d.date, count: d.count };
    });
    
    let pathD = `M ${points[0].x} ${points[0].y}`;
    let fillD = `M ${points[0].x} ${height - padding} L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
      fillD += ` L ${points[i].x} ${points[i].y}`;
    }
    
    fillD += ` L ${points[points.length - 1].x} ${height - padding} Z`;
    
    // Draw grid lines
    let gridLines = "";
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - padding * 2) / 4);
      const val = Math.round(maxVal - (i * maxVal / 4));
      gridLines += `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
        <text x="${padding - 5}" y="${y + 4}" fill="rgba(0,0,0,0.4)" font-size="9" text-anchor="end">${val}</text>
      `;
    }
    
    // Draw columns & x labels
    let colElements = "";
    points.forEach(p => {
      colElements += `
        <text x="${p.x}" y="${height - 10}" fill="rgba(0,0,0,0.5)" font-size="10" text-anchor="middle">${p.label}</text>
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#5c59e7" stroke="#ffffff" stroke-width="1.5" />
        <text x="${p.x}" y="${p.y - 8}" fill="#0f172a" font-size="8" font-weight="bold" text-anchor="middle">${p.count}</text>
      `;
    });
    
    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
        <defs>
          <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5c59e7" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#5c59e7" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        
        ${gridLines}
        
        <!-- Fill Area Under Path -->
        <path d="${fillD}" fill="url(#chart-glow)" />
        
        <!-- Line Path -->
        <path d="${pathD}" fill="none" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        
        ${colElements}
      </svg>
    `;
  }

  drawPopularDestinationsChart() {
    const container = document.getElementById("analytics-bar-chart");
    if (!container) return;
    
    const data = this.analytics.popularDestinations.slice(0, 5);
    const maxVal = Math.max(...data.map(d => d.count)) * 1.1;
    
    let html = "";
    data.forEach(item => {
      const pct = (item.count / maxVal) * 100;
      html += `
        <div class="analytics-bar-row">
          <div class="bar-label">${item.name}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: 0%;" data-width="${pct}%"></div>
          </div>
          <div class="bar-value">${item.count} searches</div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Trigger animations in microtask
    setTimeout(() => {
      const fills = container.querySelectorAll(".bar-fill");
      fills.forEach(f => {
        f.style.width = f.getAttribute("data-width");
      });
    }, 50);
  }

  drawLanguageMetrics() {
    const container = document.getElementById("analytics-pie-chart");
    if (!container) return;
    
    const data = this.analytics.languageMetrics;
    let html = "";
    
    data.forEach(item => {
      let colorClass = "indigo";
      if (item.lang === "Hindi") colorClass = "emerald";
      else if (item.lang === "Spanish") colorClass = "amber";
      else if (item.lang === "Mandarin") colorClass = "rose";
      
      html += `
        <div class="lang-row">
          <div class="lang-header">
            <div class="lang-dot ${colorClass}"></div>
            <span>${item.lang}</span>
            <strong>${item.percentage}%</strong>
          </div>
          <div class="lang-progress-track">
            <div class="lang-progress-fill ${colorClass}" style="width: ${item.percentage}%"></div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  }

  drawFrequentQueries() {
    const container = document.getElementById("analytics-queries-list");
    if (!container) return;
    container.innerHTML = "";
    
    const queries = this.analytics.frequentQueries.slice(0, 5);
    queries.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "query-item-row";
      div.innerHTML = `
        <div class="query-rank">#${index + 1}</div>
        <div class="query-text">"${item.query}"</div>
        <div class="query-count">${item.count} requests</div>
      `;
      container.appendChild(div);
    });
  }
}

// Attach globally
window.analytics = new CampusAnalytics();
