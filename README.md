# Smart AI Campus Concierge Kiosk System

A premium, high-fidelity, self-contained touch-screen kiosk application designed for college campuses (Visitors, Freshmen, Parents, Faculty, Alumni, and Staff). 

Inspired by professional self-service check-in terminals, this project features a modern light theme, locked 1600x902px aspect ratio scaling, interactive pathfinding navigation, RAG voice integration, and full admin capabilities.

---

## 🚀 Key Features

* **Touch-Screen Welcomer Screen**: Collapsing sidebar, spacious layout, and 4 high-contrast quick-navigation touch cards: *Campus Pathfinder*, *Ask AI Concierge*, *Canteen & Shuttles*, and *Admissions & Guides*.
* **Responsive 1600x902px Auto-Scaling**: Constrained aspect-ratio template that scales automatically to fit any physical monitor or browser window cleanly.
* **Interactive 2D Pathfinding Map**: HTML5 Canvas graph routing drawing paths with Dijkstra's algorithm. Includes wheelchair-accessible restriction pathing, walking durations, and step-by-step directions lists.
* **Conversational AI RAG Engine**: Scans structural database indices (fees, hostels, bus timelines, canteen menus) to answer queries with precise metadata sources.
* **Hands-Free Speech Interaction**: Web Speech SpeechRecognition voice capturing and multi-lingual SpeechSynthesis reading out answers in English, Hindi, Spanish, or Mandarin.
* **Inactivity Session Auto-Reset**: Kiosk sweeps back to the welcome portal, resets maps, inputs, and languages if left untouched for 45 seconds (includes visual progress bar countdown).
* **Live CRUD Admin Panel**: Full database creation, edits, and deletions (buses, canteen, events, faculty) written instantly to `localStorage` to reflect changes in real-time.
* **Interactive SVG Analytics**: Pure vector line and bar charts tracking visitor trends, popular buildings, query hits, and language demographics.
* **Mobile Synchronization (QR Code)**: Generates simulated QR Code cards allowing users to sync canteen tickets, directions, or routes to their mobile devices.

---

## 📂 File Directory

* `index.html` - Kiosk viewport shell container, sidebars, screens, modals, and templates.
* `style.css` - Custom property design tokens, slate bezel styles, flex/grid layouts, card structures, buttons, and transition keyframes.
* `data.js` - Mock database wrapper storing records and controlling CRUD operations.
* `map.js` - Canvas graph rendering, zoom, tap handlers, and Dijkstra route calculations.
* `ai.js` - Semantic matching RAG processor and Web Speech API integrations.
* `admin.js` - Binding forms and managing CRUD operations.
* `analytics.js` - Dynamic SVG charts generator.
* `app.js` - Unified SPA coordinator, clock, weather, language toggle, and auto-scaler logic.

---

## 🛠️ How to Run & Verify

### 1. Run via Local Server
To experience the speech synthesis, API voices, and active RAG queries, host the directory via a local HTTP server. Open your terminal in the project directory and run:

**Python**:
```bash
python -m http.server 8080
```

**Node.js**:
```bash
npx serve -l 8080
```

Then, open your web browser and navigate to:
```text
http://localhost:8080/
```

### 2. Run Directly
Alternatively, you can double-click **`index.html`** in your File Explorer to open the kiosk directly as a local file in any web browser.

---

## ⚖️ License
This project is licensed under the MIT License.
