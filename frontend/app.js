// 1. Setup IndexedDB (the phone's local database)
let db;
let isSimulatedOffline = false;

const request = indexedDB.open("VitalLinkDB", 2); // Version increased to 2 to add the new store

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create store for Health Visits
    if (!db.objectStoreNames.contains("pending_visits")) {
        db.createObjectStore("pending_visits", { keyPath: "id", autoIncrement: true });
    }
    // Create store for Water Sources
    if (!db.objectStoreNames.contains("pending_water")) {
        db.createObjectStore("pending_water", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    updateStatusBadge(); 
};

// 2. Check if we are online (Real or Simulated)
function isOnline() {
    if (isSimulatedOffline) return false;
    return navigator.onLine;
}

// 3. Toggle the simulation mode
function toggleSimulation() {
    isSimulatedOffline = !isSimulatedOffline;
    updateStatusBadge();
}

// 4. Update the UI Badge
function updateStatusBadge() {
    const badge = document.getElementById('status-badge');
    if (!isOnline()) {
        badge.style.backgroundColor = "#f44336"; // Red
        badge.innerText = "Offline Mode";
    } else {
        badge.style.backgroundColor = "#4CAF50"; // Green
        badge.innerText = "Online";
        syncPendingData(); // If online, try to sync any pending data
    }
}

window.addEventListener('online', updateStatusBadge);
window.addEventListener('offline', updateStatusBadge);

// 5. Save Health Visit
document.getElementById('visitForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const visitData = {
        chw_id: document.getElementById('chw_id').value,
        patient_age: parseInt(document.getElementById('patient_age').value),
        patient_sex: document.getElementById('patient_sex').value,
        suspected_disease: document.getElementById('suspected_disease').value
    };

    const transaction = db.transaction(["pending_visits"], "readwrite");
    transaction.objectStore("pending_visits").add(visitData);

    transaction.oncomplete = function() {
        alert("Visit saved to phone memory!");
        document.getElementById('visitForm').reset();
        if (isOnline()) syncPendingData();
    };
});

// 6. Save Water Source
document.getElementById('waterForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const waterData = {
        chw_id: document.getElementById('water_chw_id').value,
        village_name: document.getElementById('village_name').value,
        source_type: document.getElementById('source_type').value,
        is_safe: document.getElementById('is_safe').value === "true" // Convert string to boolean
    };

    const transaction = db.transaction(["pending_water"], "readwrite");
    transaction.objectStore("pending_water").add(waterData);

    transaction.oncomplete = function() {
        alert("Water check saved to phone memory!");
        document.getElementById('waterForm').reset();
        if (isOnline()) syncPendingData();
    };
});

// 7. Sync All Pending Data to the Backend
async function syncPendingData() {
    if (!db) return;

    // Sync Visits
    const visitTx = db.transaction(["pending_visits"], "readonly");
    const visitRequest = visitTx.objectStore("pending_visits").getAll();

    visitRequest.onsuccess = async function() {
        const visits = visitRequest.result;
        for (let visit of visits) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/visits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(visit)
                });
                if (response.ok) {
                    const deleteTx = db.transaction(["pending_visits"], "readwrite");
                    deleteTx.objectStore("pending_visits").delete(visit.id);
                    console.log("Synced visit:", visit.id);
                }
            } catch (error) {
                console.error("Visit sync failed.");
            }
        }
    };

    // Sync Water Sources
    const waterTx = db.transaction(["pending_water"], "readonly");
    const waterRequest = waterTx.objectStore("pending_water").getAll();

    waterRequest.onsuccess = async function() {
        const waterSources = waterRequest.result;
        for (let water of waterSources) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/water', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(water)
                });
                if (response.ok) {
                    const deleteTx = db.transaction(["pending_water"], "readwrite");
                    deleteTx.objectStore("pending_water").delete(water.id);
                    console.log("Synced water source:", water.id);
                }
            } catch (error) {
                console.error("Water sync failed.");
            }
        }
    };
}