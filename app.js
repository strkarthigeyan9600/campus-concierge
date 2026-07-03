// Smart AI Campus Concierge - Main Application Shell Controller

class CampusApp {
  constructor() {
    this.currentScreen = "home";
    this.selectedPersona = "visitor";
    
    // Core engine links
    this.mapController = null;
    this.activeVoiceSynthesis = true;
    
    // Reset timer state
    this.idleTimeRemaining = 45;
    this.idleTimerInterval = null;
    
    // Translate languages
    this.languages = {
      en: {
        welcome: "Welcome to Nexus Campus",
        tagline: "Your autonomous intelligent kiosk assistant",
        searchPlaceholder: "Type something or ask 'Where is Tech Block A?'...",
        micListening: "Listening...",
        micHold: "Tap microphone to speak",
        emergencyAlert: "Emergency Access"
      },
      es: {
        welcome: "Bienvenido al Campus Nexus",
        tagline: "Su asistente de quiosco inteligente autónomo",
        searchPlaceholder: "Escriba algo o pregunte '¿Dónde está el Bloque Tecnológico A?'...",
        micListening: "Escuchando...",
        micHold: "Toque el micrófono para hablar",
        emergencyAlert: "Acceso de Emergencia"
      },
      hi: {
        welcome: "नेक्सस कैंपस में आपका स्वागत है",
        tagline: "का स्वायत्त बुद्धिमान कियोस्क सहायक",
        searchPlaceholder: "कुछ लिखें या पूछें 'टेक ब्लॉक ए कहां है?'...",
        micListening: "सुन रहा हूँ...",
        micHold: "बोलने के लिए माइक्रोफ़ोन दबाएं",
        emergencyAlert: "आपातकालीन पहुँच"
      },
      zh: {
        welcome: "欢迎来到 Nexus 校园",
        tagline: "您的自主智能自助终端助手",
        searchPlaceholder: "输入内容或问 'A栋教学楼在哪里?'...",
        micListening: "正在聆听...",
        micHold: "点击麦克风开始说话",
        emergencyAlert: "紧急访问"
      }
    };
    this.currentLang = "en";
    
    this.init();
  }

  init() {
    this.setupClock();
    this.setupWeather();
    this.setupEventListeners();
    this.switchPersona("visitor");
    this.renderAll();
    this.setupIdleTimer();
    this.setupAutoScaling();
    
    // Initialize Map on tab switch or immediately
    setTimeout(() => {
      this.mapController = new window.CampusMap("navigation-canvas");
      this.populateMapSelects();
    }, 100);

    // Initial greeting in Chat
    this.addChatBubble("ai", "Hello! I am your Campus Concierge AI. How can I assist you today? Feel free to ask about buildings, cabins, buses, food, or admissions guidelines. Tap the microphone if you prefer to speak!", "Concierge Handbook");
  }

  setupIdleTimer() {
    this.resetIdleTimer();
    
    const activityEvents = ["click", "touchstart", "mousemove", "keydown", "scroll"];
    activityEvents.forEach(evt => {
      document.addEventListener(evt, () => this.resetIdleTimer(), { passive: true });
    });

    if (this.idleTimerInterval) clearInterval(this.idleTimerInterval);
    this.idleTimerInterval = setInterval(() => {
      this.idleTimeRemaining--;
      this.updateIdleTimerUI();

      if (this.idleTimeRemaining <= 0) {
        this.triggerKioskReset();
      }
    }, 1000);
  }

  resetIdleTimer() {
    this.idleTimeRemaining = 45;
    this.updateIdleTimerUI();
  }

  updateIdleTimerUI() {
    const fill = document.getElementById("kiosk-idle-progress");
    const label = document.getElementById("kiosk-idle-seconds");
    if (fill) {
      const percentage = (this.idleTimeRemaining / 45) * 100;
      fill.style.width = `${percentage}%`;
    }
    if (label) {
      label.innerText = Math.max(0, this.idleTimeRemaining);
    }
  }

  triggerKioskReset() {
    this.switchScreen("home");
    
    if (this.mapController) {
      this.mapController.clearRoute();
    }
    
    const selectStart = document.getElementById("map-start-select");
    const selectEnd = document.getElementById("map-end-select");
    if (selectStart) selectStart.value = "";
    if (selectEnd) selectEnd.value = "";
    
    const langSelect = document.getElementById("header-language-select");
    if (langSelect) {
      langSelect.value = "en";
      langSelect.dispatchEvent(new Event("change"));
    }
    
    this.switchPersona("visitor");
    this.resetIdleTimer();
  }

  setupAutoScaling() {
    const adjustScale = () => {
      const shell = document.getElementById("kiosk-mainframe");
      if (!shell) return;
      const targetW = 1600;
      const targetH = 902;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const scaleX = winW / targetW;
      const scaleY = winH / targetH;
      const scale = Math.min(scaleX, scaleY);
      shell.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };
    
    window.addEventListener("resize", adjustScale);
    adjustScale();
  }

  setupClock() {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      
      const clockVal = document.getElementById("header-clock-val");
      const dateVal = document.getElementById("header-date-val");
      
      if (clockVal) clockVal.innerText = timeStr;
      if (dateVal) dateVal.innerText = dateStr;
    };
    update();
    setInterval(update, 1000);
  }

  setupWeather() {
    const temps = [28, 29, 30, 27, 26];
    const conds = ["Sunny", "Partly Cloudy", "Drizzle", "Humid"];
    
    const update = () => {
      const temp = temps[Math.floor(Math.random() * temps.length)];
      const cond = conds[Math.floor(Math.random() * conds.length)];
      const weatherVal = document.getElementById("header-weather-val");
      if (weatherVal) {
        weatherVal.innerHTML = `<span class="weather-icon">⛅</span> ${temp}°C, ${cond}`;
      }
    };
    update();
    setInterval(update, 300000); // 5 mins
  }

  setupEventListeners() {
    // Sidebar Navigation
    const links = document.querySelectorAll(".sidebar-nav-link");
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const screenId = link.getAttribute("data-screen");
        this.switchScreen(screenId);
      });
    });

    // Persona buttons
    const personaBtns = document.querySelectorAll(".persona-btn");
    personaBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const persona = btn.getAttribute("data-persona");
        this.switchPersona(persona);
      });
    });

    // Chat submit handlers
    const chatInput = document.getElementById("chat-query-input");
    const chatBtn = document.getElementById("chat-send-btn");
    
    const triggerSearch = () => {
      const q = chatInput.value.trim();
      if (!q) return;
      chatInput.value = "";
      this.handleUserQuery(q);
    };

    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") triggerSearch();
      });
    }
    if (chatBtn) {
      chatBtn.addEventListener("click", triggerSearch);
    }

    // Microphone toggle
    const micBtn = document.getElementById("chat-mic-btn");
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        window.ai.toggleSpeech(this.currentLang);
      });
    }

    // Mute/unmute speech synthesis
    const speechToggle = document.getElementById("chat-voice-synthesis-toggle");
    if (speechToggle) {
      speechToggle.addEventListener("click", () => {
        this.activeVoiceSynthesis = !this.activeVoiceSynthesis;
        speechToggle.classList.toggle("active", this.activeVoiceSynthesis);
        speechToggle.querySelector("span").innerText = this.activeVoiceSynthesis ? "🔊 Voice On" : "🔇 Voice Muted";
        if (!this.activeVoiceSynthesis) {
          window.ai.stopSpeaking();
        }
      });
    }

    // Audio status callbacks
    window.onAISpeechStatusChange = (listening) => {
      const waveform = document.getElementById("chat-voice-waveform");
      const statusText = document.getElementById("chat-voice-status-text");
      if (waveform) {
        waveform.classList.toggle("active", listening);
      }
      if (statusText) {
        statusText.innerText = listening 
          ? this.languages[this.currentLang].micListening 
          : this.languages[this.currentLang].micHold;
      }
      if (micBtn) {
        micBtn.classList.toggle("active", listening);
      }
    };

    window.onAISpeechResult = (transcript) => {
      this.handleUserQuery(transcript);
    };

    // Emergency Modal
    const emergencyBtn = document.getElementById("header-emergency-btn");
    const emergencyClose = document.getElementById("emergency-modal-close");
    const emergencyModal = document.getElementById("emergency-modal");
    
    if (emergencyBtn) {
      emergencyBtn.addEventListener("click", () => {
        emergencyModal.classList.add("active");
      });
    }
    if (emergencyClose) {
      emergencyClose.addEventListener("click", () => {
        emergencyModal.classList.remove("active");
      });
    }

    // QR Mobile Sync Modal close
    const qrClose = document.getElementById("qr-modal-close");
    const qrModal = document.getElementById("qr-modal");
    if (qrClose) {
      qrClose.addEventListener("click", () => {
        qrModal.classList.remove("active");
      });
    }

    // Map Select change triggers
    const selectStart = document.getElementById("map-start-select");
    const selectEnd = document.getElementById("map-end-select");
    const accessibilityCheckbox = document.getElementById("map-access-checkbox");
    
    if (selectStart) {
      selectStart.addEventListener("change", () => {
        if (this.mapController) {
          this.mapController.setStart(selectStart.value);
        }
      });
    }
    if (selectEnd) {
      selectEnd.addEventListener("change", () => {
        if (this.mapController) {
          this.mapController.setEnd(selectEnd.value);
        }
      });
    }
    if (accessibilityCheckbox) {
      accessibilityCheckbox.addEventListener("change", () => {
        if (this.mapController) {
          this.mapController.setAccessibility(accessibilityCheckbox.checked);
        }
      });
    }

    // Map routing event callback
    window.onRouteCalculated = (routeData) => {
      document.getElementById("map-summary-distance").innerText = `${routeData.distance} meters`;
      document.getElementById("map-summary-time").innerText = `${routeData.time} minutes`;
      
      const stepsList = document.getElementById("map-summary-steps");
      if (stepsList) {
        stepsList.innerHTML = routeData.path.map((name, i) => `
          <li>
            <div class="step-num">${i + 1}</div>
            <div class="step-text">${i === 0 ? "Start at" : i === routeData.path.length - 1 ? "Arrive at" : "Walk past"} <strong>${name}</strong></div>
          </li>
        `).join("");
      }
    };

    // Map Clicked callback
    window.onMapBuildingSelected = (bId) => {
      const b = window.db.getBuilding(bId);
      if (b) {
        this.openBuildingDetailsModal(b);
      }
    };

    // Language Selector
    const langSelector = document.getElementById("header-language-select");
    if (langSelector) {
      langSelector.addEventListener("change", () => {
        const lang = langSelector.value;
        this.currentLang = lang;
        window.ai.setLanguage(lang);
        this.applyLanguageTranslations();
      });
    }
  }

  applyLanguageTranslations() {
    const dict = this.languages[this.currentLang];
    
    // Update main text placeholders
    const headerTitle = document.getElementById("header-logo-title");
    if (headerTitle) headerTitle.innerText = dict.welcome;
    
    const searchInput = document.getElementById("chat-query-input");
    if (searchInput) searchInput.setAttribute("placeholder", dict.searchPlaceholder);
    
    const voiceStatus = document.getElementById("chat-voice-status-text");
    if (voiceStatus) voiceStatus.innerText = dict.micHold;
    
    const emerAlertBtn = document.getElementById("header-emergency-btn");
    if (emerAlertBtn) {
      emerAlertBtn.innerHTML = `🚨 <strong>${dict.emergencyAlert}</strong>`;
    }
  }

  switchPersona(persona) {
    this.selectedPersona = persona;
    
    // Highlight UI toggle button
    document.querySelectorAll(".persona-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-persona") === persona);
    });

    // Update active highlight classes on sidebar navigation options
    // Highlight menus that are highly relevant to this persona
    const relevanceMap = {
      fresher: ["student_guide", "map", "canteen", "bus", "hostel", "events"],
      parent: ["parent_guide", "admissions", "hostel", "map", "emergency"],
      visitor: ["map", "canteen", "events", "emergency"],
      alumni: ["events", "analytics", "faculty", "map"],
      faculty: ["faculty", "bus", "canteen", "admin", "analytics", "emergency"],
      staff: ["bus", "canteen", "admin", "analytics", "emergency"]
    };

    const highlights = relevanceMap[persona] || [];
    
    document.querySelectorAll(".sidebar-nav-link").forEach(link => {
      const screenId = link.getAttribute("data-screen");
      const badge = link.querySelector(".nav-relevance-badge");
      if (highlights.includes(screenId)) {
        link.classList.add("recommended");
        if (badge) badge.style.display = "block";
      } else {
        link.classList.remove("recommended");
        if (badge) badge.style.display = "none";
      }
    });

    // Update highlights section on homepage based on persona
    this.renderHomeHighlights();
  }

  switchScreen(screenId) {
    this.currentScreen = screenId;
    
    // Hide sidebar on welcome home screen, show on sub-screens
    const workspace = document.querySelector(".kiosk-workspace");
    if (workspace) {
      workspace.classList.toggle("hide-sidebar", screenId === "home");
    }
    
    // Highlight sidebar link
    document.querySelectorAll(".sidebar-nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-screen") === screenId);
    });
    
    // Switch active display container
    document.querySelectorAll(".screen-container").forEach(screen => {
      screen.classList.toggle("active", screen.id === `screen-${screenId}`);
    });
    
    // Trigger special screen render helpers
    if (screenId === "map") {
      setTimeout(() => {
        if (this.mapController) {
          this.mapController.resizeCanvas();
        }
      }, 150);
    } else if (screenId === "analytics") {
      window.analytics.renderDashboard();
    } else if (screenId === "admin") {
      window.admin.renderAdminTables();
    }
  }

  // Locates building on map and switches screens
  locateOnMap(buildingId) {
    this.switchScreen("map");
    const selectEnd = document.getElementById("map-end-select");
    if (selectEnd) {
      selectEnd.value = buildingId;
      // Trigger change
      selectEnd.dispatchEvent(new Event("change"));
    }
  }

  // Generate mobile QR synchronization overlay
  syncWithMobile(type, summaryText) {
    const modal = document.getElementById("qr-modal");
    const label = document.getElementById("qr-content-label");
    const codeContainer = document.getElementById("qr-code-canvas-container");
    
    if (!modal) return;
    label.innerText = `Scan to sync ${type} direct details to your mobile phone.`;
    
    // Create actual simulated QR Canvas drawing
    codeContainer.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    
    // Render a simulated styled QR block
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,160,160);
    ctx.fillStyle = "#1e1b4b"; // Deep Indigo
    
    // Draw 3 primary corner anchor boxes
    const drawAnchor = (x, y) => {
      ctx.fillRect(x, y, 32, 32);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x+4, y+4, 24, 24);
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(x+8, y+8, 16, 16);
    };
    drawAnchor(8, 8);
    drawAnchor(120, 8);
    drawAnchor(8, 120);
    
    // Draw random barcode noises
    for (let r = 8; r < 152; r += 6) {
      for (let c = 8; c < 152; c += 6) {
        // Skip corner areas
        const isCorner = (r < 44 && c < 44) || (r < 44 && c > 116) || (r > 116 && c < 44);
        if (!isCorner && Math.random() > 0.45) {
          ctx.fillRect(r, c, 5, 5);
        }
      }
    }
    
    codeContainer.appendChild(canvas);
    modal.classList.add("active");
  }

  // Renders items from DB inside pages
  renderAll() {
    this.renderHomeHighlights();
    this.renderHomeAnnouncements();
    this.renderHomeEvents();
    
    this.renderAdmissionsPage();
    this.renderStudentGuidePage();
    this.renderParentGuidePage();
    this.renderFacultyFinderPage();
    this.renderBusPage();
    this.renderHostelPage();
    this.renderCanteenPage();
    this.renderEmergencyPage();
    this.renderEventsPage();
  }

  renderHomeHighlights() {
    const list = document.getElementById("home-highlights-grid");
    if (!list) return;
    list.innerHTML = "";
    
    // Custom greeting templates depending on persona
    const greetings = {
      fresher: {
        title: "Welcome Freshman!",
        text: "Make sure to register for courses, complete document verification, and visit your hostel warden. Explore campus layout in Maps."
      },
      parent: {
        title: "Welcome Parents",
        text: "Review hostel fee details, principal consultation slots, academic calendar events, and emergency safety contacts."
      },
      visitor: {
        title: "Welcome Visitor",
        text: "Access the interactive campus pathfinder, look up faculty cabins, and discover upcoming open workshops and seminars."
      },
      alumni: {
        title: "Welcome Back, Alumni!",
        text: "See recent campus statistics, join the Homecoming Alumni Meet, and view state-of-the-art incubation laboratories."
      },
      faculty: {
        title: "Welcome Professor",
        text: "Configure your office hours directory, edit notice boards, update class schedules, and review bus loops."
      },
      staff: {
        title: "Welcome Staff Member",
        text: "Verify security alerts, configure canteen schedules, manage bus routes, and review analytics dashboards."
      }
    };
    
    const info = greetings[this.selectedPersona] || greetings.visitor;
    
    const item = document.createElement("div");
    item.className = "home-greeting-card card-premium";
    item.innerHTML = `
      <h3>${info.title}</h3>
      <p>${info.text}</p>
      <div class="quick-actions-bar">
        <button class="kiosk-btn primary" onclick="window.app.switchScreen('map')">🗺️ Campus Map</button>
        <button class="kiosk-btn" onclick="window.app.switchScreen('assistant')">💬 Ask AI Concierge</button>
      </div>
    `;
    list.appendChild(item);
  }

  renderHomeAnnouncements() {
    const container = document.getElementById("home-announcements-list");
    if (!container) return;
    container.innerHTML = "";
    
    const anns = window.db.getAnnouncements();
    anns.slice(0, 3).forEach(ann => {
      const div = document.createElement("div");
      div.className = `ann-card ${ann.urgent ? 'urgent' : ''}`;
      div.innerHTML = `
        <div class="ann-header">
          <strong>${ann.title}</strong>
          <span class="ann-date">${ann.date}</span>
        </div>
        <p>${ann.text}</p>
      `;
      container.appendChild(div);
    });
  }

  renderHomeEvents() {
    const container = document.getElementById("home-events-list");
    if (!container) return;
    container.innerHTML = "";
    
    const evts = window.db.getEvents();
    evts.slice(0, 2).forEach(evt => {
      const div = document.createElement("div");
      div.className = "home-evt-card card-premium";
      div.innerHTML = `
        <div class="evt-tag">${evt.type}</div>
        <h4>${evt.title}</h4>
        <div class="evt-details">
          <span>📅 ${evt.date}</span>
          <span>📍 ${evt.venue}</span>
        </div>
      `;
      container.appendChild(div);
    });
  }

  renderAdmissionsPage() {
    const list = document.getElementById("admissions-courses-list");
    if (!list) return;
    list.innerHTML = "";
    
    const adm = window.db.getAdmissions();
    
    // Set Eligibility Box
    const uBox = document.getElementById("adm-eligibility-undergrad");
    const pBox = document.getElementById("adm-eligibility-postgrad");
    if (uBox) uBox.innerText = adm.eligibility.undergrad;
    if (pBox) pBox.innerText = adm.eligibility.postgrad;
    
    // Set Document Checklist
    const docList = document.getElementById("adm-docs-list");
    if (docList) {
      docList.innerHTML = adm.documents.map(d => `<li>✔️ ${d}</li>`).join("");
    }
    
    // Set Important Dates
    const datesTbody = document.getElementById("adm-dates-tbody");
    if (datesTbody) {
      datesTbody.innerHTML = adm.dates.map(d => `
        <tr>
          <td><strong>${d.event}</strong></td>
          <td>${d.date}</td>
        </tr>
      `).join("");
    }
    
    // Set Program Courses
    adm.courses.forEach(c => {
      const item = document.createElement("div");
      item.className = "admissions-course-card card-premium";
      item.innerHTML = `
        <h4>${c.name}</h4>
        <div style="margin: 10px 0; font-size:13px; color:rgba(255,255,255,0.7);">
          Duration: ${c.duration} | Intake Seats: ${c.seats}
        </div>
        <div class="price-tag">₹${c.feePerYear.toLocaleString()} <span style="font-size:10px; font-weight:normal;">/ Year</span></div>
      `;
      list.appendChild(item);
    });
  }

  renderStudentGuidePage() {
    const transportGrid = document.getElementById("student-transport-grid");
    if (transportGrid) {
      transportGrid.innerHTML = `
        <div class="card-premium guide-card">
          <h4>🚍 Campus Shuttles</h4>
          <p>Complimentary loop buses run every 10 minutes connecting Hostels, Tech Blocks, Library and Canteen.</p>
        </div>
        <div class="card-premium guide-card">
          <h4>🚲 Nexus Green Bikes</h4>
          <p>Electric campus bicycles are parked outside each major building block. Swipe student ID to unlock.</p>
        </div>
      `;
    }
  }

  renderParentGuidePage() {
    const guideSection = document.getElementById("parent-offices-grid");
    if (guideSection) {
      guideSection.innerHTML = `
        <div class="card-premium guide-card" onclick="window.app.locateOnMap('admin')">
          <h4>🏢 Principal Office</h4>
          <p>First Floor, Admin Block (Room 101). Visiting Hours: 3 PM - 4:30 PM (Prior appointment required).</p>
        </div>
        <div class="card-premium guide-card" onclick="window.app.locateOnMap('admin')">
          <h4>💳 Accounts Counter</h4>
          <p>Ground Floor, Admin Block (Room 102). Fee clearance, hostel deposit, scholarship disbursement queries.</p>
        </div>
        <div class="card-premium guide-card" onclick="window.app.locateOnMap('admin')">
          <h4>📝 Exam Cell</h4>
          <p>Second Floor, Admin Block (Room 201). Grade sheet transcripts, exam schedules, registration cards.</p>
        </div>
      `;
    }
  }

  renderFacultyFinderPage() {
    const list = document.getElementById("faculty-grid-list");
    if (!list) return;
    list.innerHTML = "";
    
    window.db.getFaculty().forEach(f => {
      const card = document.createElement("div");
      card.className = "faculty-card card-premium";
      card.innerHTML = `
        <img src="${f.avatar}" class="faculty-avatar">
        <h4>${f.name}</h4>
        <div class="fac-designation">${f.designation}</div>
        <div class="fac-dept">${f.department}</div>
        
        <div class="fac-details-list">
          <div>🚪 <strong>Cabin:</strong> ${f.cabin}</div>
          <div>🕒 <strong>Hours:</strong> ${f.hours}</div>
          <div>✉️ <strong>Email:</strong> ${f.email}</div>
        </div>
        
        <div class="fac-actions">
          <button class="kiosk-btn-mini primary" onclick="window.app.locateOnMap('${f.buildingId}')">📍 Locate</button>
          <a class="kiosk-btn-mini" href="mailto:${f.email}">✉️ Contact</a>
        </div>
      `;
      list.appendChild(card);
    });
  }

  renderBusPage() {
    const list = document.getElementById("bus-routes-grid");
    if (!list) return;
    list.innerHTML = "";
    
    window.db.getBuses().forEach(b => {
      let badgeClass = "green";
      if (b.status.includes("Delayed")) badgeClass = "red";
      else if (b.status.includes("Suspended")) badgeClass = "grey";
      
      const card = document.createElement("div");
      card.className = "bus-card card-premium";
      card.innerHTML = `
        <div class="bus-header">
          <h4>${b.route}</h4>
          <span class="status-badge ${badgeClass}">${b.status}</span>
        </div>
        <div style="margin: 12px 0;">
          <strong>📍 Stops:</strong><br>
          <span style="font-size:13px; color:rgba(255,255,255,0.7);">${b.stops}</span>
        </div>
        <div style="font-size:13px;">
          🕒 <strong>Schedule:</strong> ${b.timings}
        </div>
        <div class="bus-footer-bar">
          <div class="bus-live-gps">📡 GPS: ${b.lat}</div>
          <button class="kiosk-btn-mini primary" onclick="window.app.syncWithMobile('Bus Route', '${b.route}')">📲 Sync Mobile</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  renderHostelPage() {
    const list = document.getElementById("hostels-flex-list");
    if (!list) return;
    list.innerHTML = "";
    
    window.db.getHostels().forEach(h => {
      const card = document.createElement("div");
      card.className = "hostel-card card-premium";
      card.innerHTML = `
        <h3>${h.name}</h3>
        <div class="hostel-warden-box">
          <strong>Warden:</strong> ${h.warden}<br>
          📞 ${h.contact} | ✉️ ${h.email}
        </div>
        <div style="margin:12px 0; font-size:13px;">
          🍴 <strong>Mess Timings:</strong><br>
          <span style="color:rgba(255,255,255,0.8);">${h.messTimings}</span>
        </div>
        <div class="hostel-rules-box">
          <strong>📜 General Rules:</strong>
          <ul>
            ${h.rules.map(r => `<li>${r}</li>`).join("")}
          </ul>
        </div>
      `;
      list.appendChild(card);
    });
  }

  renderCanteenPage() {
    const menu = window.db.getCanteenMenu();
    
    // Draw queue metrics
    const qCount = document.getElementById("canteen-queue-count");
    const qWait = document.getElementById("canteen-queue-wait");
    const qTraffic = document.getElementById("canteen-queue-traffic");
    
    if (qCount) qCount.innerText = menu.queueStatus.length;
    if (qWait) qWait.innerText = `${Math.round(menu.queueStatus.estTimeSec / 60)} mins`;
    if (qTraffic) {
      qTraffic.innerText = menu.queueStatus.traffic;
      qTraffic.className = `status-badge ${menu.queueStatus.traffic === "High" ? "red" : menu.queueStatus.traffic === "Moderate" ? "orange" : "green"}`;
    }
    
    const items = menu.items;
    
    // Render Breakfast category
    const bGrid = document.getElementById("canteen-breakfast-grid");
    if (bGrid) this.fillCanteenGrid(bGrid, items.filter(x => x.category === "Breakfast"));
    
    // Render Lunch category
    const lGrid = document.getElementById("canteen-lunch-grid");
    if (lGrid) this.fillCanteenGrid(lGrid, items.filter(x => x.category === "Lunch"));
    
    // Render Snacks category
    const sGrid = document.getElementById("canteen-snacks-grid");
    if (sGrid) this.fillCanteenGrid(sGrid, items.filter(x => x.category === "Snacks"));
  }

  fillCanteenGrid(grid, items) {
    grid.innerHTML = "";
    items.forEach(item => {
      const card = document.createElement("div");
      card.className = `canteen-item-card card-premium ${!item.available ? 'sold-out' : ''}`;
      card.innerHTML = `
        <div class="canteen-item-header">
          <h4>${item.name}</h4>
          <span style="font-size:11px; padding: 2px 6px; border-radius: 6px; background: rgba(255,255,255,0.08);">${item.label}</span>
        </div>
        <div class="canteen-item-details">
          <span>🔥 ${item.calories} kCal</span>
          <strong>₹${item.price}</strong>
        </div>
        <div style="margin-top: 10px; text-align:right;">
          ${item.available 
            ? `<button class="kiosk-btn-mini primary" onclick="window.app.syncWithMobile('Food Order', '${item.name}')">📲 Order (QR)</button>` 
            : `<span style="font-size:12px; color:rgba(255,50,50,0.8)">Unavailable</span>`}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderEmergencyPage() {
    const list = document.getElementById("emergency-contacts-grid");
    if (!list) return;
    list.innerHTML = `
      <div class="emergency-contact-card urgent">
        <h4>🚨 Campus Security Central</h4>
        <div class="phone-number">+91 99999 00000</div>
        <p>Immediate threat, security deployment, entry/exit disputes, lost items.</p>
      </div>
      <div class="emergency-contact-card urgent">
        <h4>🚑 Medical Desk Emergency</h4>
        <div class="phone-number">+91 99999 11111</div>
        <p>Ambulance callout, first aid clinic queue, emergency patient transfers.</p>
      </div>
      <div class="emergency-contact-card">
        <h4>🔥 Fire Safety Marshal</h4>
        <div class="phone-number">+91 99999 22222</div>
        <p>Fire alarms, hazard identification, electrical short-circuits.</p>
      </div>
    `;
  }

  renderEventsPage() {
    const list = document.getElementById("events-timeline-list");
    if (!list) return;
    list.innerHTML = "";
    
    window.db.getEvents().forEach(evt => {
      const card = document.createElement("div");
      card.className = "event-timeline-card card-premium";
      card.innerHTML = `
        <div class="evt-timeline-meta">
          <span class="evt-badge">${evt.type}</span>
          <span class="evt-date">📅 ${evt.date}</span>
        </div>
        <h3>${evt.title}</h3>
        <p style="margin: 8px 0; color:rgba(255,255,255,0.75);">${evt.description}</p>
        <div class="evt-footer">
          <span>📍 <strong>Venue:</strong> ${evt.venue}</span>
          <span>🏢 <strong>Org:</strong> ${evt.organizer}</span>
        </div>
        <div style="margin-top:10px; text-align:right;">
          <button class="kiosk-btn-mini primary" onclick="window.app.locateOnMap('admin')">🗺️ Directions</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Handle queries submitted to the chatbot
  handleUserQuery(queryText) {
    this.addChatBubble("user", queryText);
    
    // Process query using local RAG matches
    const result = window.ai.processQuery(queryText);
    
    // Add AI answer bubble
    setTimeout(() => {
      this.addChatBubble("ai", result.answer, result.source);
      
      // Auto speak out answer if voice synthesis is active
      if (this.activeVoiceSynthesis) {
        window.ai.speak(result.answer);
      }
      
      // If action suggested (like map location or tab navigation)
      if (result.action) {
        if (result.action.type === "navigate") {
          setTimeout(() => this.switchScreen(result.action.target), 2000);
        } else if (result.action.type === "map_locate") {
          setTimeout(() => this.locateOnMap(result.action.target), 2000);
        }
      }
    }, 600);
  }

  addChatBubble(sender, text, source) {
    const list = document.getElementById("chat-bubbles-container");
    if (!list) return;
    
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble-wrapper ${sender === "user" ? "user-bubble" : "ai-bubble"}`;
    
    const inner = document.createElement("div");
    inner.className = "chat-bubble";
    inner.innerHTML = `
      <p>${text.replace(/\n/g, "<br>")}</p>
      ${source ? `<div class="bubble-source">🔍 Source: ${source}</div>` : ""}
    `;
    
    bubble.appendChild(inner);
    list.appendChild(bubble);
    
    // Scroll to bottom
    list.scrollTop = list.scrollHeight;
  }

  // Opens a detail info modal for a building
  openBuildingDetailsModal(building) {
    // Show modal content
    const modal = document.getElementById("building-detail-modal");
    if (!modal) return;
    
    document.getElementById("detail-modal-title").innerText = building.name;
    document.getElementById("detail-modal-desc").innerText = building.description;
    document.getElementById("detail-modal-access").innerText = building.accessibility;
    
    const list = document.getElementById("detail-modal-rooms");
    list.innerHTML = building.rooms.map(r => `
      <li>
        <strong>Floor ${r.floor}</strong>: ${r.name} (Room ${r.number})
      </li>
    `).join("");
    
    modal.classList.add("active");
    
    // Bind buttons in modal
    document.getElementById("detail-modal-route-start").onclick = () => {
      modal.classList.remove("active");
      this.switchScreen("map");
      const selectStart = document.getElementById("map-start-select");
      if (selectStart) {
        selectStart.value = building.id;
        selectStart.dispatchEvent(new Event("change"));
      }
    };
    
    document.getElementById("detail-modal-route-end").onclick = () => {
      modal.classList.remove("active");
      this.switchScreen("map");
      const selectEnd = document.getElementById("map-end-select");
      if (selectEnd) {
        selectEnd.value = building.id;
        selectEnd.dispatchEvent(new Event("change"));
      }
    };
    
    document.getElementById("detail-modal-close").onclick = () => {
      modal.classList.remove("active");
    };
  }

  populateMapSelects() {
    const selectStart = document.getElementById("map-start-select");
    const selectEnd = document.getElementById("map-end-select");
    
    if (!selectStart || !selectEnd) return;
    
    selectStart.innerHTML = `<option value="">-- Choose Start Location --</option>`;
    selectEnd.innerHTML = `<option value="">-- Choose Destination --</option>`;
    
    window.db.getBuildings().forEach(b => {
      const opt = `<option value="${b.id}">${b.name} (${b.code})</option>`;
      selectStart.innerHTML += opt;
      selectEnd.innerHTML += opt;
    });
  }
}

// Instantiate globally
window.addEventListener("DOMContentLoaded", () => {
  window.app = new CampusApp();
});
