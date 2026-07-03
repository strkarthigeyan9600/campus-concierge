// Smart AI Campus Concierge - Conversational RAG & Voice Engine

class CampusAI {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    this.currentLanguage = "en"; // en, es, hi, zh
    
    // Default system response voice profiles
    this.voices = {
      en: { lang: "en-US", name: "Google US English" },
      es: { lang: "es-ES", name: "Google Español" },
      hi: { lang: "in-IN", name: "Google Hindi" },
      zh: { lang: "zh-CN", name: "Google Mandarin" }
    };
    
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if (this.SpeechRecognition) {
      this.recognition = new this.SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
      this.recognition.onstart = () => {
        this.isListening = true;
        if (window.onAISpeechStatusChange) {
          window.onAISpeechStatusChange(true);
        }
      };
      
      this.recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (window.onAISpeechResult) {
          window.onAISpeechResult(transcript);
        }
      };
      
      this.recognition.onerror = (e) => {
        console.error("Speech recognition error", e);
        this.isListening = false;
        if (window.onAISpeechStatusChange) {
          window.onAISpeechStatusChange(false);
        }
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        if (window.onAISpeechStatusChange) {
          window.onAISpeechStatusChange(false);
        }
      };
    }
  }

  toggleSpeech(lang) {
    if (!this.recognition) {
      alert("Speech recognition not supported in this browser. Please try Chrome.");
      return;
    }
    
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.lang = this.voices[lang || this.currentLanguage].lang;
      this.recognition.start();
    }
  }

  setLanguage(lang) {
    if (this.voices[lang]) {
      this.currentLanguage = lang;
    }
  }

  speak(text) {
    if (!this.speechSynthesis) return;
    
    // Stop any ongoing speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceSetting = this.voices[this.currentLanguage];
    utterance.lang = voiceSetting.lang;
    
    // Try to find the actual system voice matching language
    const sysVoices = this.speechSynthesis.getVoices();
    const matchingVoice = sysVoices.find(v => v.lang.startsWith(voiceSetting.lang.substring(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    this.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  // Client-Side RAG Retrieval and Response Generation
  processQuery(query) {
    const q = query.toLowerCase().trim();
    window.db.incrementQueryCount(query);
    
    // 1. Canteen Queries
    if (q.includes("canteen") || q.includes("food") || q.includes("menu") || q.includes("eat") || q.includes("price")) {
      const menu = window.db.getCanteenMenu();
      const items = menu.items.filter(item => item.available);
      
      if (q.includes("price") || q.includes("cost") || q.includes("how much")) {
        const costStr = items.map(i => `${i.name}: ₹${i.price}`).slice(0, 4).join(", ");
        return {
          answer: `The canteen prices are very reasonable. For example, ${costStr}. The active queue has ${menu.queueStatus.length} people waiting.`,
          source: "Canteen Operations & Menu Database",
          action: { type: "navigate", target: "canteen" }
        };
      }
      
      const dishes = items.map(i => i.name).slice(0, 5).join(", ");
      return {
        answer: `Today's menu at the Main Food Court includes: ${dishes}, and more. The current queue length is ${menu.queueStatus.length} people with an estimated wait time of ${Math.round(menu.queueStatus.estTimeSec / 60)} minutes.`,
        source: "Live Canteen Counter API",
        action: { type: "navigate", target: "canteen" }
      };
    }
    
    // 2. Bus / Transport Queries
    if (q.includes("bus") || q.includes("route") || q.includes("transport") || q.includes("shuttle") || q.includes("timing")) {
      const buses = window.db.getBuses();
      const activeBuses = buses.filter(b => b.active);
      
      if (q.includes("route 1") || q.includes("north city")) {
        const b = buses.find(x => x.id === "bus_route1");
        return {
          answer: `Route 1 (North City Shuttle) runs from Metro Station to NIT Main Gate. Timings: ${b.timings}. Status: ${b.status} (${b.lat}).`,
          source: "Internal Bus Tracker GPS",
          action: { type: "navigate", target: "bus" }
        };
      }
      
      const summary = activeBuses.map(b => `${b.route}: ${b.status}`).join("; ");
      return {
        answer: `Currently we have ${activeBuses.length} active campus bus services operating. ${summary}.`,
        source: "Campus Fleet Control",
        action: { type: "navigate", target: "bus" }
      };
    }
    
    // 3. Admission Queries
    if (q.includes("admission") || q.includes("eligibility") || q.includes("course") || q.includes("fee") || q.includes("scholarship") || q.includes("seat")) {
      const adm = window.db.getAdmissions();
      
      if (q.includes("eligibility") || q.includes("qualify")) {
        return {
          answer: `Eligibility criteria: \n- ${adm.eligibility.undergrad} \n- ${adm.eligibility.postgrad}`,
          source: "Admissions Brochure 2026",
          action: { type: "navigate", target: "admissions" }
        };
      }
      
      if (q.includes("scholarship") || q.includes("discount") || q.includes("waiver")) {
        return {
          answer: `NIT offers several scholarships: \n- ${adm.scholarships.join("\n- ")}`,
          source: "Student Financial Aid Handbook",
          action: { type: "navigate", target: "admissions" }
        };
      }
      
      if (q.includes("fee") || q.includes("cost") || q.includes("charge")) {
        const feeDetails = adm.courses.map(c => `${c.name}: ₹${c.feePerYear.toLocaleString()}/year`).join("\n");
        return {
          answer: `Here is the fee structure for major programs:\n${feeDetails}`,
          source: "Office of the Bursar / Admissions Cell",
          action: { type: "navigate", target: "admissions" }
        };
      }
      
      const courseList = adm.courses.map(c => c.name).join(", ");
      return {
        answer: `NIT offers multiple B.Tech and M.Tech programs including: ${courseList}. Online applications are open till July 15, 2026.`,
        source: "Academic Senate Registry",
        action: { type: "navigate", target: "admissions" }
      };
    }
    
    // 4. Hostel Queries
    if (q.includes("hostel") || q.includes("warden") || q.includes("room") || q.includes("mess") || q.includes("rules")) {
      const hostels = window.db.getHostels();
      
      if (q.includes("rule") || q.includes("curfew") || q.includes("time")) {
        return {
          answer: `Hostel rules state:\n- Alpha (Boys): In-time is 9:30 PM. \n- Beta (Girls): In-time is 9:00 PM. No electrical heaters allowed.`,
          source: "Office of Student Affairs - Residential Life Rules",
          action: { type: "navigate", target: "hostel" }
        };
      }
      
      if (q.includes("warden") || q.includes("contact") || q.includes("email")) {
        const wardenStr = hostels.map(h => `${h.name}: Warden is ${h.warden} (${h.contact}, ${h.email})`).join("\n");
        return {
          answer: `Hostel Wardens Contacts:\n${wardenStr}`,
          source: "Warden Directory",
          action: { type: "navigate", target: "hostel" }
        };
      }
      
      return {
        answer: `We have two primary hostels on campus: Hostel Alpha for boys (warden: Mr. Rajendra Prasad) and Hostel Beta for girls (warden: Dr. Sunita Deshmukh). Both offer hygienic meals and active common areas.`,
        source: "Hostel Wardens Association",
        action: { type: "navigate", target: "hostel" }
      };
    }
    
    // 5. Faculty / Staff Queries
    if (q.includes("faculty") || q.includes("teacher") || q.includes("professor") || q.includes("dr.") || q.includes("prof.") || q.includes("sharma") || q.includes("patel") || q.includes("iyer") || q.includes("dutta") || q.includes("singh")) {
      const facs = window.db.getFaculty();
      
      // Look up specific faculty members
      const matchingFac = facs.find(f => {
        const nameParts = f.name.toLowerCase().split(" ");
        return nameParts.some(part => part.length > 2 && q.includes(part));
      });
      
      if (matchingFac) {
        return {
          answer: `${matchingFac.name} is an ${matchingFac.designation} in the ${matchingFac.department} department. Cabin: ${matchingFac.cabin}. Office Hours: ${matchingFac.hours}. Email: ${matchingFac.email}.`,
          source: "NIT Staff Roster Directory",
          action: { type: "map_locate", target: matchingFac.buildingId }
        };
      }
      
      const facList = facs.map(f => f.name).join(", ");
      return {
        answer: `Faculty Finder matches members like ${facList}. Try asking specifically about a professor, like 'Where is Dr. Ramesh Sharma?' or 'When are Dr. Ananya Patel's office hours?'`,
        source: "Academic Directory Database",
        action: { type: "navigate", target: "faculty" }
      };
    }
    
    // 6. Navigation / Map Location Queries
    if (q.includes("where") || q.includes("reach") || q.includes("location") || q.includes("map") || q.includes("path") || q.includes("find") || q.includes("go to") || q.includes("navigate")) {
      const buildings = window.db.getBuildings();
      const matchingBuilding = buildings.find(b => {
        const bName = b.name.toLowerCase();
        const bCode = b.code.toLowerCase();
        return q.includes(bName) || q.includes(bCode) || q.includes(bIdMatches(b.id, q));
      });
      
      function bIdMatches(id, query) {
        const parts = id.split("_");
        return parts.some(p => p.length > 2 && query.includes(p));
      }
      
      if (matchingBuilding) {
        window.db.incrementDestinationSearch(matchingBuilding.name);
        return {
          answer: `The ${matchingBuilding.name} (${matchingBuilding.code}) is located on the coordinates grid (x:${matchingBuilding.x}, y:${matchingBuilding.y}). ${matchingBuilding.description} Accessibility: ${matchingBuilding.accessibility}`,
          source: "Campus Geographical Registry",
          action: { type: "map_locate", target: matchingBuilding.id }
        };
      }
    }
    
    // 7. Event & Announcements Queries
    if (q.includes("event") || q.includes("hackathon") || q.includes("placement") || q.includes("seminar") || q.includes("notice") || q.includes("news")) {
      const evts = window.db.getEvents();
      
      if (q.includes("hack") || q.includes("hacknexus")) {
        const e = evts.find(x => x.id === "evt_hacknexus");
        return {
          answer: `HackNexus 2026 is scheduled for ${e.date} at the ${e.venue}. It's organized by the ${e.organizer}. Details: ${e.description}`,
          source: "NIT Events Bulletin Board",
          action: { type: "navigate", target: "events" }
        };
      }
      
      if (q.includes("placement") || q.includes("job") || q.includes("recruit")) {
        const e = evts.find(x => x.id === "evt_placement");
        return {
          answer: `The Campus Mega Placement Drive runs from ${e.date} in the ${e.venue}. More than 25+ companies are hiring. Organizer: ${e.organizer}`,
          source: "Placement Cell Notice",
          action: { type: "navigate", target: "events" }
        };
      }
      
      const list = evts.map(e => e.title).join(", ");
      return {
        answer: `Upcoming major events: ${list}. Check the events dashboard for schedules and locations.`,
        source: "Events & Announcements Hub",
        action: { type: "navigate", target: "events" }
      };
    }
    
    // 8. Emergency Queries
    if (q.includes("emergency") || q.includes("doctor") || q.includes("hurt") || q.includes("accident") || q.includes("fire") || q.includes("police") || q.includes("hospital") || q.includes("medical")) {
      return {
        answer: `🚨 EMERGENCY ASSISTANCE: Campus Hospital & Medical Center has a 24/7 observation ward. Quick Dial Security: +91 99999 00000. Medical Desk: +91 99999 11111. All buildings contain fire exits and AEDs.`,
        source: "Campus Security & Safety Guidelines",
        action: { type: "navigate", target: "emergency" }
      };
    }

    // Default response (fallback grounded answer)
    return {
      answer: `Welcome to the Nexus Institute of Technology Kiosk! I can assist you with Campus Navigation (including indoor room lookup), Faculty Cabin offices, Canteen menus, Bus tracking, Admissions criteria, Hostel wardens, or Emergency contacts. Please ask a specific campus question!`,
      source: "NIT Concierge General FAQ Index"
    };
  }
}

// Attach globally
window.ai = new CampusAI();
