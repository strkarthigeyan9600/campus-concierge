// Smart AI Campus Concierge - Admin Dashboard Panel Manager

class CampusAdmin {
  constructor() {
    this.currentEditType = null;
    this.currentEditId = null;
  }

  // Reloads all tables in the admin panel UI
  renderAdminTables() {
    this.renderBuildingsTable();
    this.renderFacultyTable();
    this.renderEventsTable();
    this.renderCanteenTable();
    this.renderBusesTable();
  }

  renderBuildingsTable() {
    const tbody = document.getElementById("admin-buildings-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    window.db.getBuildings().forEach(b => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${b.code}</strong></td>
        <td>${b.name}</td>
        <td>(${b.x}, ${b.y})</td>
        <td>${b.rooms.length} Rooms</td>
        <td>
          <button class="kiosk-btn-mini edit-btn" onclick="window.admin.editItem('building', '${b.id}')">Edit</button>
          <button class="kiosk-btn-mini delete-btn" onclick="window.admin.deleteItem('building', '${b.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderFacultyTable() {
    const tbody = document.getElementById("admin-faculty-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    window.db.getFaculty().forEach(f => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="user-cell">
            <img src="${f.avatar}" width="32" height="32" class="avatar-circle">
            <div>
              <strong>${f.name}</strong><br>
              <small>${f.designation}</small>
            </div>
          </div>
        </td>
        <td>${f.department}</td>
        <td>${f.cabin}</td>
        <td>${f.hours}</td>
        <td>
          <button class="kiosk-btn-mini edit-btn" onclick="window.admin.editItem('faculty', '${f.id}')">Edit</button>
          <button class="kiosk-btn-mini delete-btn" onclick="window.admin.deleteItem('faculty', '${f.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderEventsTable() {
    const tbody = document.getElementById("admin-events-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    window.db.getEvents().forEach(e => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${e.title}</strong><br><small>${e.type}</small></td>
        <td>${e.date}</td>
        <td>${e.venue}</td>
        <td>${e.organizer}</td>
        <td>
          <button class="kiosk-btn-mini edit-btn" onclick="window.admin.editItem('event', '${e.id}')">Edit</button>
          <button class="kiosk-btn-mini delete-btn" onclick="window.admin.deleteItem('event', '${e.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderCanteenTable() {
    const tbody = document.getElementById("admin-canteen-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    window.db.getCanteenMenu().items.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td>₹${item.price}</td>
        <td>${item.available ? '<span class="status-badge green">Available</span>' : '<span class="status-badge red">Sold Out</span>'}</td>
        <td>
          <button class="kiosk-btn-mini edit-btn" onclick="window.admin.editItem('canteen', '${item.id}')">Edit</button>
          <button class="kiosk-btn-mini delete-btn" onclick="window.admin.deleteItem('canteen', '${item.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderBusesTable() {
    const tbody = document.getElementById("admin-buses-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    window.db.getBuses().forEach(b => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${b.route}</strong></td>
        <td>${b.timings}</td>
        <td>${b.status}</td>
        <td>${b.active ? '<span class="status-badge green">Active</span>' : '<span class="status-badge grey">Suspended</span>'}</td>
        <td>
          <button class="kiosk-btn-mini edit-btn" onclick="window.admin.editItem('bus', '${b.id}')">Edit</button>
          <button class="kiosk-btn-mini delete-btn" onclick="window.admin.deleteItem('bus', '${b.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Delete Action
  deleteItem(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    if (type === "building") window.db.deleteBuilding(id);
    else if (type === "faculty") window.db.deleteFaculty(id);
    else if (type === "event") window.db.deleteEvent(id);
    else if (type === "canteen") window.db.deleteCanteenItem(id);
    else if (type === "bus") window.db.deleteBus(id);
    
    this.renderAdminTables();
    if (window.app && typeof window.app.renderAll === "function") window.app.renderAll();
  }

  // Open Edit Form Modal or Populate fields
  editItem(type, id) {
    this.currentEditType = type;
    this.currentEditId = id;
    
    const modal = document.getElementById("admin-edit-modal");
    const title = document.getElementById("admin-modal-title");
    const container = document.getElementById("admin-modal-fields-container");
    
    if (!modal || !container) return;
    container.innerHTML = "";
    modal.classList.add("active");
    
    if (type === "building") {
      const item = window.db.getBuilding(id) || { id: "b_" + Date.now(), name: "", code: "", x: 400, y: 300, description: "", rooms: [], accessibility: "" };
      title.innerText = id ? "Edit Building" : "Add Building";
      this.currentEditId = item.id;
      
      container.innerHTML = `
        <label>Building Name</label>
        <input type="text" id="edit-b-name" value="${item.name}" required>
        <label>Building Code (3 chars)</label>
        <input type="text" id="edit-b-code" value="${item.code}" maxLength="3" required>
        <div style="display:flex; gap:10px;">
          <div style="flex:1;">
            <label>X Coord (0-800)</label>
            <input type="number" id="edit-b-x" value="${item.x}" required>
          </div>
          <div style="flex:1;">
            <label>Y Coord (0-600)</label>
            <input type="number" id="edit-b-y" value="${item.y}" required>
          </div>
        </div>
        <label>Description</label>
        <textarea id="edit-b-desc">${item.description}</textarea>
        <label>Accessibility Services</label>
        <input type="text" id="edit-b-access" value="${item.accessibility}">
      `;
    } else if (type === "faculty") {
      const item = window.db.getFaculty().find(f => f.id === id) || { id: "fac_" + Date.now(), name: "", designation: "", department: "", cabin: "", email: "", phone: "", hours: "", avatar: "", buildingId: "admin" };
      title.innerText = id ? "Edit Faculty Member" : "Add Faculty Member";
      this.currentEditId = item.id;
      
      // Load building options
      const buildingOpts = window.db.getBuildings().map(b => `<option value="${b.id}" ${b.id === item.buildingId ? 'selected' : ''}>${b.name}</option>`).join("");
      
      container.innerHTML = `
        <label>Faculty Full Name</label>
        <input type="text" id="edit-f-name" value="${item.name}" required>
        <label>Designation</label>
        <input type="text" id="edit-f-desg" value="${item.designation}" required>
        <label>Department</label>
        <input type="text" id="edit-f-dept" value="${item.department}" required>
        <label>Cabin Details</label>
        <input type="text" id="edit-f-cabin" value="${item.cabin}" required>
        <label>Email Address</label>
        <input type="email" id="edit-f-email" value="${item.email}" required>
        <label>Office Hours</label>
        <input type="text" id="edit-f-hours" value="${item.hours}" placeholder="e.g. Mon, Wed: 2:00 PM - 4:00 PM">
        <label>Allocated Building (for navigation)</label>
        <select id="edit-f-building">${buildingOpts}</select>
      `;
    } else if (type === "event") {
      const item = window.db.getEvents().find(e => e.id === id) || { id: "evt_" + Date.now(), title: "", type: "", date: "", time: "", venue: "", description: "", organizer: "" };
      title.innerText = id ? "Edit Event" : "Create Event";
      this.currentEditId = item.id;
      
      container.innerHTML = `
        <label>Event Title</label>
        <input type="text" id="edit-e-title" value="${item.title}" required>
        <label>Event Type</label>
        <input type="text" id="edit-e-type" value="${item.type}" placeholder="e.g. Workshop, Guest Lecture, Seminar">
        <label>Date Range / Day</label>
        <input type="text" id="edit-e-date" value="${item.date}" required>
        <label>Time Schedule</label>
        <input type="text" id="edit-e-time" value="${item.time}">
        <label>Venue (Location)</label>
        <input type="text" id="edit-e-venue" value="${item.venue}" required>
        <label>Description</label>
        <textarea id="edit-e-desc">${item.description}</textarea>
        <label>Organizer Department</label>
        <input type="text" id="edit-e-org" value="${item.organizer}">
      `;
    } else if (type === "canteen") {
      const item = window.db.getCanteenMenu().items.find(i => i.id === id) || { id: "item_" + Date.now(), name: "", category: "Snacks", price: 50, calories: 200, available: true, label: "Veg" };
      title.innerText = id ? "Edit Food Item" : "Add Food Item";
      this.currentEditId = item.id;
      
      container.innerHTML = `
        <label>Dish Name</label>
        <input type="text" id="edit-c-name" value="${item.name}" required>
        <label>Category</label>
        <select id="edit-c-cat">
          <option value="Breakfast" ${item.category === "Breakfast" ? "selected" : ""}>Breakfast</option>
          <option value="Lunch" ${item.category === "Lunch" ? "selected" : ""}>Lunch</option>
          <option value="Snacks" ${item.category === "Snacks" ? "selected" : ""}>Snacks</option>
          <option value="Beverages" ${item.category === "Beverages" ? "selected" : ""}>Beverages</option>
        </select>
        <label>Price (INR)</label>
        <input type="number" id="edit-c-price" value="${item.price}" required>
        <label>Calorie Count</label>
        <input type="number" id="edit-c-cals" value="${item.calories}">
        <label>Label</label>
        <input type="text" id="edit-c-label" value="${item.label}" placeholder="e.g. Veg, Non-Veg, Spicy">
        <label>Availability</label>
        <select id="edit-c-avail">
          <option value="true" ${item.available ? "selected" : ""}>Available</option>
          <option value="false" ${!item.available ? "selected" : ""}>Sold Out / Unavailable</option>
        </select>
      `;
    } else if (type === "bus") {
      const item = window.db.getBuses().find(b => b.id === id) || { id: "bus_" + Date.now(), route: "", stops: "", timings: "", status: "On Time", lat: "Not Running", active: true };
      title.innerText = id ? "Edit Bus Route" : "Add Bus Route";
      this.currentEditId = item.id;
      
      container.innerHTML = `
        <label>Route Label</label>
        <input type="text" id="edit-bus-route" value="${item.route}" placeholder="e.g. Route 4: West City Shuttle" required>
        <label>List of Stops (Comma-separated)</label>
        <input type="text" id="edit-bus-stops" value="${item.stops}">
        <label>Schedules / Timings</label>
        <input type="text" id="edit-bus-timings" value="${item.timings}">
        <label>Live GPS Status Message</label>
        <input type="text" id="edit-bus-lat" value="${item.lat}">
        <label>Route Running Status</label>
        <select id="edit-bus-status">
          <option value="On Time" ${item.status === "On Time" ? "selected" : ""}>On Time</option>
          <option value="Delayed (5 mins)" ${item.status.includes("Delayed") ? "selected" : ""}>Delayed</option>
          <option value="Suspended" ${item.status.includes("Suspended") ? "selected" : ""}>Suspended</option>
        </select>
        <label>Active Fleet Item</label>
        <select id="edit-bus-active">
          <option value="true" ${item.active ? "selected" : ""}>Yes</option>
          <option value="false" ${!item.active ? "selected" : ""}>No</option>
        </select>
      `;
    }
  }

  // Save Modal Form Changes
  saveModalChanges() {
    const type = this.currentEditType;
    const id = this.currentEditId;
    
    if (type === "building") {
      const old = window.db.getBuilding(id) || { rooms: [] };
      const building = {
        id,
        name: document.getElementById("edit-b-name").value,
        code: document.getElementById("edit-b-code").value.toUpperCase(),
        x: parseInt(document.getElementById("edit-b-x").value),
        y: parseInt(document.getElementById("edit-b-y").value),
        description: document.getElementById("edit-b-desc").value,
        rooms: old.rooms, // Preserve rooms
        accessibility: document.getElementById("edit-b-access").value
      };
      window.db.saveBuilding(building);
    } else if (type === "faculty") {
      const name = document.getElementById("edit-f-name").value;
      const seedName = name.split(" ").pop();
      const faculty = {
        id,
        name,
        designation: document.getElementById("edit-f-desg").value,
        department: document.getElementById("edit-f-dept").value,
        cabin: document.getElementById("edit-f-cabin").value,
        email: document.getElementById("edit-f-email").value,
        phone: "+91 98765 432" + Math.floor(Math.random() * 90 + 10),
        hours: document.getElementById("edit-f-hours").value,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${seedName}`,
        buildingId: document.getElementById("edit-f-building").value
      };
      window.db.saveFaculty(faculty);
    } else if (type === "event") {
      const event = {
        id,
        title: document.getElementById("edit-e-title").value,
        type: document.getElementById("edit-e-type").value,
        date: document.getElementById("edit-e-date").value,
        time: document.getElementById("edit-e-time").value,
        venue: document.getElementById("edit-e-venue").value,
        description: document.getElementById("edit-e-desc").value,
        organizer: document.getElementById("edit-e-org").value
      };
      window.db.saveEvent(event);
    } else if (type === "canteen") {
      const item = {
        id,
        name: document.getElementById("edit-c-name").value,
        category: document.getElementById("edit-c-cat").value,
        price: parseInt(document.getElementById("edit-c-price").value),
        calories: parseInt(document.getElementById("edit-c-cals").value) || 0,
        available: document.getElementById("edit-c-avail").value === "true",
        label: document.getElementById("edit-c-label").value
      };
      window.db.saveCanteenItem(item);
    } else if (type === "bus") {
      const bus = {
        id,
        route: document.getElementById("edit-bus-route").value,
        stops: document.getElementById("edit-bus-stops").value,
        timings: document.getElementById("edit-bus-timings").value,
        status: document.getElementById("edit-bus-status").value,
        lat: document.getElementById("edit-bus-lat").value,
        active: document.getElementById("edit-bus-active").value === "true"
      };
      window.db.saveBus(bus);
    }
    
    // Close Modal
    this.closeModal();
    this.renderAdminTables();
    if (window.app && typeof window.app.renderAll === "function") {
      window.app.renderAll();
    }
  }

  closeModal() {
    const modal = document.getElementById("admin-edit-modal");
    if (modal) {
      modal.classList.remove("active");
    }
    this.currentEditType = null;
    this.currentEditId = null;
  }
}

// Attach globally
window.admin = new CampusAdmin();
