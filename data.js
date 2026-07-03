// Smart AI Campus Concierge System - Database File

const DEFAULT_CAMPUS_DATA = {
  buildings: [
    {
      id: "admin",
      name: "Administrative Block",
      code: "ADM",
      x: 400,
      y: 350,
      description: "Central administrative headquarters. Houses the Principal's Office, Registrar, Accounts Department, Admissions Cell, and Exam Cell.",
      departments: ["Principal Office", "Accounts Department", "Registrar Office", "Exam Cell", "Admissions Office"],
      rooms: [
        { name: "Principal Office", number: "101", floor: "Ground" },
        { name: "Accounts Counter 1 & 2", number: "102", floor: "Ground" },
        { name: "Registrar Chamber", number: "103", floor: "Ground" },
        { name: "Exam Controller Office", number: "201", floor: "First" },
        { name: "Admissions Reception", number: "105", floor: "Ground" }
      ],
      accessibility: "Ramps at main entry, elevators to all floors, braille signage."
    },
    {
      id: "tech_a",
      name: "Tech Block A (Computer Science)",
      code: "TBA",
      x: 250,
      y: 200,
      description: "Center for Computing and Information Technology. Houses Computer Science faculty, laboratories, and high-performance server rooms.",
      departments: ["Computer Science & Engineering", "Information Technology", "AI & Robotics Lab"],
      rooms: [
        { name: "Advanced Computing Lab", number: "101", floor: "Ground" },
        { name: "Robotics & AI Center", number: "102", floor: "Ground" },
        { name: "CSE Faculty Cabins", number: "201-210", floor: "First" },
        { name: "Server Room", number: "305", floor: "Second" },
        { name: "Seminar Hall 1", number: "301", floor: "Second" }
      ],
      accessibility: "Elevator, tactile paths, wheelchair-accessible restrooms."
    },
    {
      id: "tech_b",
      name: "Tech Block B (Mechanical & Electrical)",
      code: "TBB",
      x: 550,
      y: 200,
      description: "Center for Electrical, Electronics, and Mechanical Engineering. Features heavy labs, workshops, and testing facilities.",
      departments: ["Electrical Engineering", "Electronics & Communication", "Mechanical Engineering"],
      rooms: [
        { name: "Machine Workshop", number: "101", floor: "Ground" },
        { name: "Microprocessors Lab", number: "202", floor: "First" },
        { name: "ECE Faculty Cabins", number: "205-215", floor: "First" },
        { name: "Power Systems Lab", number: "104", floor: "Ground" },
        { name: "CAD/CAM Studio", number: "303", floor: "Second" }
      ],
      accessibility: "Elevator, ramp access."
    },
    {
      id: "science",
      name: "Science Block",
      code: "SCB",
      x: 320,
      y: 480,
      description: "Houses the fundamental sciences: Physics, Chemistry, and Mathematics, along with Humanities and Biotechnology labs.",
      departments: ["Physics Department", "Chemistry Department", "Mathematics", "Biotechnology"],
      rooms: [
        { name: "Applied Physics Lab", number: "101", floor: "Ground" },
        { name: "Organic Chemistry Lab", number: "102", floor: "Ground" },
        { name: "Biotech Research Lab", number: "201", floor: "First" },
        { name: "Faculty Cabins 101-105", number: "103", floor: "Ground" },
        { name: "Lecture Theater A", number: "301", floor: "Second" }
      ],
      accessibility: "Ramp access, Ground floor fully accessible, stairs only for upper floors."
    },
    {
      id: "library",
      name: "Central Library",
      code: "LIB",
      x: 480,
      y: 480,
      description: "Three-story knowledge reservoir with over 100,000 volumes, 50+ research database subscriptions, a digital library, and individual study carrels.",
      departments: ["Digital Library Section", "Reference Section", "Periodicals", "Silent Study Lounge"],
      rooms: [
        { name: "Circulation Desk", number: "G1", floor: "Ground" },
        { name: "Digital Resource Center", number: "F1", floor: "First" },
        { name: "Research Reading Room", number: "S2", floor: "Second" },
        { name: "Discussion Rooms A-D", number: "S3", floor: "Second" }
      ],
      accessibility: "Elevators, low-height counters, audio-book resources for visually impaired."
    },
    {
      id: "canteen",
      name: "Main Canteen & Food Court",
      code: "CAN",
      x: 400,
      y: 120,
      description: "Multicuisine food court offering hygienic meals, snacks, beverages, and custom order items. Includes indoor and outdoor dining spaces.",
      departments: ["Main Kitchen", "Coffee Day Express", "Fresh Juice Bar"],
      rooms: [
        { name: "Cash Counter", number: "1", floor: "Ground" },
        { name: "Food Delivery Counters", number: "2-4", floor: "Ground" },
        { name: "Indoor Seating Area", number: "Hall A", floor: "Ground" }
      ],
      accessibility: "Fully accessible ground level, double-wide doors."
    },
    {
      id: "hostel_alpha",
      name: "Hostel Alpha (Boys)",
      code: "HA",
      x: 150,
      y: 350,
      description: "Residential facility for male students. Features an in-house gym, common recreation room, and 24/7 security.",
      departments: ["Hostel Warden Office", "Mess Hall Alpha"],
      rooms: [
        { name: "Warden Office", number: "101", floor: "Ground" },
        { name: "Mess Hall", number: "MH1", floor: "Ground" },
        { name: "Recreation Room", number: "102", floor: "Ground" }
      ],
      accessibility: "Wheelchair-accessible ground floor rooms, ramps."
    },
    {
      id: "hostel_beta",
      name: "Hostel Beta (Girls)",
      code: "HB",
      x: 650,
      y: 350,
      description: "Residential facility for female students. Features dynamic security controls, in-house library corner, indoor gym, and mess hall.",
      departments: ["Hostel Warden Office", "Mess Hall Beta"],
      rooms: [
        { name: "Warden Office", number: "101", floor: "Ground" },
        { name: "Mess Hall", number: "MH2", floor: "Ground" },
        { name: "Gym & Activity Room", number: "102", floor: "Ground" }
      ],
      accessibility: "Secure gated access, wheelchair-accessible ground floor."
    },
    {
      id: "sports",
      name: "Sports Complex & Gym",
      code: "SPT",
      x: 500,
      y: 60,
      description: "Indoor sports arena containing badminton courts, table tennis tables, yoga studios, and a fully equipped cardio & weight training gym.",
      departments: ["Sports Department", "Gymnasium"],
      rooms: [
        { name: "Physical Director Office", number: "101", floor: "Ground" },
        { name: "Indoor Badminton Courts", number: "1-3", floor: "Ground" },
        { name: "Fitness Center / Gym", number: "201", floor: "First" }
      ],
      accessibility: "Ground level ramp access, accessible showers and lockers."
    },
    {
      id: "hospital",
      name: "Campus Hospital & Medical Center",
      code: "MED",
      x: 300,
      y: 60,
      description: "24/7 emergency medical center. Provides basic diagnostics, emergency care, inpatient observation, and pharmacy services.",
      departments: ["Emergency Care Unit", "Outpatient Department", "Pharmacy"],
      rooms: [
        { name: "OPD Reception & Waiting", number: "101", floor: "Ground" },
        { name: "Doctor Consultation Room 1", number: "102", floor: "Ground" },
        { name: "Observation Ward", number: "103", floor: "Ground" },
        { name: "Pharmacy Counter", number: "104", floor: "Ground" }
      ],
      accessibility: "Stretcher-friendly ramps, automated external defibrillators (AED), ambulance bay."
    }
  ],
  
  navigationNodes: [
    { id: "node_tech_a", name: "Tech Block A Gate", x: 250, y: 200, isBuilding: true },
    { id: "node_tech_b", name: "Tech Block B Gate", x: 550, y: 200, isBuilding: true },
    { id: "node_admin", name: "Admin Block Plaza", x: 400, y: 350, isBuilding: true },
    { id: "node_science", name: "Science Block Plaza", x: 320, y: 480, isBuilding: true },
    { id: "node_library", name: "Library Plaza", x: 480, y: 480, isBuilding: true },
    { id: "node_canteen", name: "Canteen Plaza", x: 400, y: 120, isBuilding: true },
    { id: "node_hostel_alpha", name: "Hostel Alpha Gate", x: 150, y: 350, isBuilding: true },
    { id: "node_hostel_beta", name: "Hostel Beta Gate", x: 650, y: 350, isBuilding: true },
    { id: "node_sports", name: "Sports Complex Plaza", x: 500, y: 60, isBuilding: true },
    { id: "node_hospital", name: "Hospital Entrance", x: 300, y: 60, isBuilding: true },
    
    // Intermediate pathway nodes (crossroads)
    { id: "junc_north", name: "North Crossroads", x: 400, y: 200, isBuilding: false },
    { id: "junc_west", name: "West Pathway Intersection", x: 280, y: 350, isBuilding: false },
    { id: "junc_east", name: "East Pathway Intersection", x: 520, y: 350, isBuilding: false },
    { id: "junc_south", name: "South Crossroads", x: 400, y: 480, isBuilding: false }
  ],
  
  navigationEdges: [
    { from: "node_canteen", to: "junc_north", distance: 80, accessible: true },
    { from: "node_hospital", to: "node_canteen", distance: 100, accessible: true },
    { from: "node_sports", to: "node_canteen", distance: 100, accessible: true },
    { from: "node_tech_a", to: "junc_north", distance: 150, accessible: true },
    { from: "node_tech_b", to: "junc_north", distance: 150, accessible: true },
    { from: "junc_north", to: "node_admin", distance: 150, accessible: true },
    { from: "node_tech_a", to: "node_hostel_alpha", distance: 180, accessible: true },
    { from: "node_tech_b", to: "node_hostel_beta", distance: 180, accessible: true },
    { from: "node_hostel_alpha", to: "junc_west", distance: 130, accessible: true },
    { from: "node_hostel_beta", to: "junc_east", distance: 130, accessible: true },
    { from: "junc_west", to: "node_admin", distance: 120, accessible: true },
    { from: "junc_east", to: "node_admin", distance: 120, accessible: true },
    { from: "junc_west", to: "node_science", distance: 140, accessible: true },
    { from: "junc_east", to: "node_library", distance: 140, accessible: true },
    { from: "node_admin", to: "junc_south", distance: 130, accessible: true },
    { from: "node_science", to: "junc_south", distance: 80, accessible: true },
    { from: "node_library", to: "junc_south", distance: 80, accessible: true }
  ],
  
  faculty: [
    {
      id: "fac_dr_sharma",
      name: "Dr. Ramesh Sharma",
      designation: "Head of Department, CSE",
      department: "Computer Science & Engineering",
      cabin: "Cabin 201, Tech Block A (TBA)",
      email: "r.sharma@nit.edu",
      phone: "+91 98765 43210",
      hours: "Mon, Wed: 2:00 PM - 4:00 PM",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ramesh",
      buildingId: "tech_a"
    },
    {
      id: "fac_dr_patel",
      name: "Dr. Ananya Patel",
      designation: "Associate Professor, AI & Robotics",
      department: "Computer Science & Engineering",
      cabin: "Cabin 203, Tech Block A (TBA)",
      email: "ananya.patel@nit.edu",
      phone: "+91 98765 43211",
      hours: "Tue, Thu: 10:00 AM - 12:00 PM",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ananya",
      buildingId: "tech_a"
    },
    {
      id: "fac_prof_singh",
      name: "Prof. Vikram Singh",
      designation: "Professor, Power Systems",
      department: "Electrical Engineering",
      cabin: "Cabin 205, Tech Block B (TBB)",
      email: "v.singh@nit.edu",
      phone: "+91 98765 43212",
      hours: "Wednesday: 11:00 AM - 1:00 PM",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram",
      buildingId: "tech_b"
    },
    {
      id: "fac_dr_iyer",
      name: "Dr. Meenakshi Iyer",
      designation: "Senior Professor, Organic Chemistry",
      department: "Chemistry Department",
      cabin: "Cabin 103, Science Block (SCB)",
      email: "m.iyer@nit.edu",
      phone: "+91 98765 43213",
      hours: "Friday: 3:00 PM - 5:00 PM",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Meenakshi",
      buildingId: "science"
    },
    {
      id: "fac_dr_dutta",
      name: "Dr. Subhradeep Dutta",
      designation: "Dean of Academic Affairs",
      department: "Mathematics & Academics",
      cabin: "Admin Block Room 201 (ADM)",
      email: "dean.academics@nit.edu",
      phone: "+91 98765 43201",
      hours: "Mon-Fri: 11:30 AM - 12:30 PM",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Subhradeep",
      buildingId: "admin"
    }
  ],
  
  buses: [
    {
      id: "bus_route1",
      route: "Route 1: North City Shuttle",
      stops: "Tech Park, Lakeview, Central Metro Station, Main Gate NIT",
      timings: "Departs Metro Station every 20 mins (6:00 AM - 10:00 PM)",
      status: "On Time",
      lat: "Running (Near Lakeview)",
      active: true
    },
    {
      id: "bus_route2",
      route: "Route 2: South Express",
      stops: "Downtown Hub, South Plaza, West Avenue, Main Gate NIT",
      timings: "Departs Downtown every 15 mins (6:30 AM - 9:30 PM)",
      status: "Delayed (5 mins due to traffic)",
      lat: "Running (Near West Avenue)",
      active: true
    },
    {
      id: "bus_route3",
      route: "Route 3: Campus Loop (Internal)",
      stops: "Boys Hostel, Canteen, Tech Block A, Library, Admin Block, Girls Hostel",
      timings: "Runs continuously every 10 mins (8:00 AM - 8:00 PM)",
      status: "On Time",
      lat: "Running (Near Library)",
      active: true
    }
  ],
  
  canteenMenu: {
    queueStatus: {
      length: 12,
      estTimeSec: 240, // 4 mins
      traffic: "Moderate" // Low, Moderate, High
    },
    items: [
      { id: "item_poha", name: "Premium Indori Poha", category: "Breakfast", price: 35, calories: 180, available: true, label: "Veg / Light" },
      { id: "item_idli", name: "Steamed Idli Sambar", category: "Breakfast", price: 45, calories: 150, available: true, label: "Veg / Healthy" },
      { id: "item_thali", name: "Special NIT Thali", category: "Lunch", price: 90, calories: 650, available: true, label: "Veg / Heavy" },
      { id: "item_burger", name: "Crispy Paneer Burger", category: "Snacks", price: 65, calories: 350, available: true, label: "Veg" },
      { id: "item_noodles", name: "Schezwan Hakka Noodles", category: "Snacks", price: 70, calories: 420, available: true, label: "Veg / Spicy" },
      { id: "item_coffee", name: "Cold Coffee with Ice Cream", category: "Beverages", price: 50, calories: 250, available: true, label: "Sweet" },
      { id: "item_sandwich", name: "Grilled Club Sandwich", category: "Snacks", price: 55, calories: 280, available: false, label: "Out of Stock" }
    ]
  },
  
  hostels: [
    {
      name: "Hostel Alpha (Boys)",
      warden: "Mr. Rajendra Prasad",
      contact: "+91 99999 88881",
      email: "warden.alpha@nit.edu",
      messTimings: "Breakfast: 7:30 AM - 9:00 AM | Lunch: 12:30 PM - 2:00 PM | Dinner: 7:30 PM - 9:00 PM",
      rules: [
        "In-time for students is 9:30 PM sharp.",
        "Guests are only allowed in the visitor room after entering names in the register.",
        "Strict penalty for use of electrical appliances like heaters or hotplates.",
        "Anti-ragging guidelines are fully enforced. Violations lead to immediate expulsion."
      ]
    },
    {
      name: "Hostel Beta (Girls)",
      warden: "Dr. Sunita Deshmukh",
      contact: "+91 99999 88882",
      email: "warden.beta@nit.edu",
      messTimings: "Breakfast: 7:30 AM - 9:00 AM | Lunch: 12:30 PM - 2:00 PM | Dinner: 7:30 PM - 9:00 PM",
      rules: [
        "In-time for students is 9:00 PM sharp.",
        "Parent/Guardian permission via SMS/Portal is required for night-outs.",
        "Non-resident females are allowed in rooms only with Warden's written permission.",
        "Zero tolerance for substance abuse or ragging of any kind."
      ]
    }
  ],
  
  admissions: {
    eligibility: {
      undergrad: "B.Tech: Min 60% in 12th Std (PCM) + valid JEE Main/State Entrance score.",
      postgrad: "M.Tech: B.E./B.Tech in relevant branch with valid GATE score."
    },
    courses: [
      { name: "Computer Science & Engineering (B.Tech)", duration: "4 Years", seats: 180, feePerYear: 185000 },
      { name: "Electronics & Communication Engineering (B.Tech)", duration: "4 Years", seats: 120, feePerYear: 165000 },
      { name: "Electrical & Electronics Engineering (B.Tech)", duration: "4 Years", seats: 60, feePerYear: 155000 },
      { name: "Mechanical Engineering (B.Tech)", duration: "4 Years", seats: 60, feePerYear: 155000 },
      { name: "AI & Data Science (M.Tech)", duration: "2 Years", seats: 18, feePerYear: 110000 }
    ],
    documents: [
      "Class 10th & 12th Marksheet & Passing Certificate",
      "JEE Main/GATE Admit Card & Rank Scorecard",
      "Transfer & Migration Certificate from previous school/college",
      "Category Certificate (if applicable for reservations)",
      "Income Certificate (for fee waivers/scholarships)",
      "4 passport size color photographs"
    ],
    dates: [
      { event: "Online Registration Starts", date: "June 10, 2026" },
      { event: "Registration Deadline", date: "July 15, 2026" },
      { event: "First Round Seat Allocation", date: "July 22, 2026" },
      { event: "Document Verification", date: "July 25 - July 28, 2026" },
      { event: "Induction Program & Classes Begin", date: "August 10, 2026" }
    ],
    scholarships: [
      "Merit-based: 100% Tuition Fee Waiver for Rankers in top 1000 of JEE Main.",
      "Need-based: Up to 50% tuition scholarship for family income < ₹3 LPA.",
      "Sports quota: 25% waiver for State-level representation, 50% for National level."
    ]
  },
  
  events: [
    {
      id: "evt_hacknexus",
      title: "HackNexus 2026",
      type: "Hackathon",
      date: "July 12-14, 2026",
      time: "9:00 AM onwards (48 Hours)",
      venue: "Advanced Computing Lab, Tech Block A",
      description: "Annual national level 48-hour student hackathon. Focused on building solutions for Smart Cities, Climate Tech, and Healthcare.",
      organizer: "ACM Student Chapter & CSE Dept"
    },
    {
      id: "evt_placement",
      title: "Campus Mega Placement Drive 2026",
      type: "Placement",
      date: "July 20-22, 2026",
      time: "9:00 AM - 6:00 PM",
      venue: "Auditorium & Seminar Halls, Admin Block",
      description: "Recruitment drive hosting 25+ top-tier product and consulting corporations. Open to all final year B.Tech/M.Tech students.",
      organizer: "Training & Placement Cell"
    },
    {
      id: "evt_quantum",
      title: "Guest Lecture: Quantum Leap in Computing",
      type: "Guest Lecture",
      date: "July 28, 2026",
      time: "2:30 PM - 4:00 PM",
      venue: "Lecture Theater A, Science Block",
      description: "Keynote presentation by Dr. Evelyn Cross from IBM Quantum Labs, covering topological qubits and quantum cryptography breakthroughs.",
      organizer: "Physics & CS Departments"
    },
    {
      id: "evt_alumni",
      title: "Alumni Homecoming Meet 2026",
      type: "Alumni Meet",
      date: "August 15, 2026",
      time: "10:30 AM onwards",
      venue: "Main Amphitheater / Sports Complex Area",
      description: "Reconnect with your alma mater, network with industry leaders, and attend the awards ceremony for distinguished alumni.",
      organizer: "NIT Alumni Relations Office"
    }
  ],
  
  announcements: [
    { id: "ann_1", title: "Main Campus Gate Maintenance", text: "The main gate entrance will remain closed for road paving on Sunday (July 5). Please use Gate No. 2 (North Side).", date: "July 3, 2026", urgent: true },
    { id: "ann_2", title: "Exam Registration Deadline Extended", text: "Exam registration dates for supplementary papers have been extended till July 8, 2026. Submit forms at Exam Cell counter.", date: "July 2, 2026", urgent: false },
    { id: "ann_3", title: "Monsoon Health Advisory", text: "Due to changing weather conditions, the campus clinic advises all residents to follow food hygiene and contact the doctor immediately for any fever symptoms.", date: "July 1, 2026", urgent: false }
  ],
  
  analytics: {
    kioskSessions: 1420,
    averageSessionTimeSec: 112,
    popularDestinations: [
      { name: "Admin Block", count: 320 },
      { name: "Main Canteen", count: 280 },
      { name: "Tech Block A", count: 245 },
      { name: "Central Library", count: 185 },
      { name: "Science Block", count: 90 }
    ],
    frequentQueries: [
      { query: "How to reach Admin Block principal office?", count: 140 },
      { query: "Canteen today's menu", count: 110 },
      { query: "Where is Dr. Ramesh Sharma?", count: 95 },
      { query: "Bus timing for Route 1", count: 85 },
      { query: "B.Tech admission eligibility and fee", count: 70 }
    ],
    languageMetrics: [
      { lang: "English", percentage: 70 },
      { lang: "Hindi", percentage: 20 },
      { lang: "Spanish", percentage: 6 },
      { lang: "Mandarin", percentage: 4 }
    ],
    dailyVisitors: [
      { date: "Mon", count: 280 },
      { date: "Tue", count: 310 },
      { date: "Wed", count: 350 },
      { date: "Thu", count: 340 },
      { date: "Fri", count: 390 },
      { date: "Sat", count: 180 },
      { date: "Sun", count: 120 }
    ]
  }
};

class CampusDatabase {
  constructor() {
    this.storageKey = "NIT_CAMPUS_CONCIERGE_DATA";
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to read from localStorage. Initializing defaults.", e);
    }
    this.saveData(DEFAULT_CAMPUS_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
  }

  saveData(newData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(newData || this.data));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }

  resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
    this.saveData();
  }

  getBuildings() {
    return this.data.buildings;
  }

  getBuilding(id) {
    return this.data.buildings.find(b => b.id === id);
  }

  saveBuilding(building) {
    const idx = this.data.buildings.findIndex(b => b.id === building.id);
    if (idx !== -1) {
      this.data.buildings[idx] = building;
    } else {
      this.data.buildings.push(building);
    }
    this.saveData();
  }

  deleteBuilding(id) {
    this.data.buildings = this.data.buildings.filter(b => b.id !== id);
    this.saveData();
  }

  getFaculty() {
    return this.data.faculty;
  }

  saveFaculty(fac) {
    const idx = this.data.faculty.findIndex(f => f.id === fac.id);
    if (idx !== -1) {
      this.data.faculty[idx] = fac;
    } else {
      this.data.faculty.push(fac);
    }
    this.saveData();
  }

  deleteFaculty(id) {
    this.data.faculty = this.data.faculty.filter(f => f.id !== id);
    this.saveData();
  }

  getBuses() {
    return this.data.buses;
  }

  saveBus(bus) {
    const idx = this.data.buses.findIndex(b => b.id === bus.id);
    if (idx !== -1) {
      this.data.buses[idx] = bus;
    } else {
      this.data.buses.push(bus);
    }
    this.saveData();
  }

  deleteBus(id) {
    this.data.buses = this.data.buses.filter(b => b.id !== id);
    this.saveData();
  }

  getCanteenMenu() {
    return this.data.canteenMenu;
  }

  saveCanteenItem(item) {
    const idx = this.data.canteenMenu.items.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      this.data.canteenMenu.items[idx] = item;
    } else {
      this.data.canteenMenu.items.push(item);
    }
    this.saveData();
  }

  deleteCanteenItem(id) {
    this.data.canteenMenu.items = this.data.canteenMenu.items.filter(i => i.id !== id);
    this.saveData();
  }

  updateQueue(len, traffic) {
    this.data.canteenMenu.queueStatus.length = len;
    this.data.canteenMenu.queueStatus.estTimeSec = len * 20; // 20s per person
    this.data.canteenMenu.queueStatus.traffic = traffic;
    this.saveData();
  }

  getHostels() {
    return this.data.hostels;
  }

  saveHostel(hostel) {
    const idx = this.data.hostels.findIndex(h => h.name === hostel.name);
    if (idx !== -1) {
      this.data.hostels[idx] = hostel;
    } else {
      this.data.hostels.push(hostel);
    }
    this.saveData();
  }

  getAdmissions() {
    return this.data.admissions;
  }

  saveAdmissions(adm) {
    this.data.admissions = adm;
    this.saveData();
  }

  getEvents() {
    return this.data.events;
  }

  saveEvent(evt) {
    const idx = this.data.events.findIndex(e => e.id === evt.id);
    if (idx !== -1) {
      this.data.events[idx] = evt;
    } else {
      this.data.events.push(evt);
    }
    this.saveData();
  }

  deleteEvent(id) {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.saveData();
  }

  getAnnouncements() {
    return this.data.announcements;
  }

  saveAnnouncement(ann) {
    const idx = this.data.announcements.findIndex(a => a.id === ann.id);
    if (idx !== -1) {
      this.data.announcements[idx] = ann;
    } else {
      this.data.announcements.push(ann);
    }
    this.saveData();
  }

  deleteAnnouncement(id) {
    this.data.announcements = this.data.announcements.filter(a => a.id !== id);
    this.saveData();
  }

  getAnalytics() {
    return this.data.analytics;
  }

  incrementQueryCount(queryText) {
    // Standardize query
    const q = queryText.trim().toLowerCase();
    const existing = this.data.analytics.frequentQueries.find(item => item.query.toLowerCase() === q);
    if (existing) {
      existing.count++;
    } else {
      this.data.analytics.frequentQueries.push({ query: queryText, count: 1 });
    }
    // Sort queries
    this.data.analytics.frequentQueries.sort((a,b) => b.count - a.count);
    this.data.analytics.kioskSessions++;
    this.saveData();
  }

  incrementDestinationSearch(destName) {
    const existing = this.data.analytics.popularDestinations.find(item => item.name === destName);
    if (existing) {
      existing.count++;
    } else {
      this.data.analytics.popularDestinations.push({ name: destName, count: 1 });
    }
    this.data.analytics.popularDestinations.sort((a,b) => b.count - a.count);
    this.saveData();
  }
}

// Attach globally
window.db = new CampusDatabase();
window.DEFAULT_CAMPUS_DATA = DEFAULT_CAMPUS_DATA;
