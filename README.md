# VitalLink: Offline-First Community Health Platform

VitalLink is a lightweight, offline-first web application designed for Community Health Workers (CHWs) in Sierra Leone. It allows health workers to record patient visits and water source checks in areas with poor or no internet connectivity, automatically syncing the data to a central district dashboard when a connection is restored.

## The Problem

In rural Sub-Saharan Africa, community health surveillance is often hindered by poor internet coverage and fragmented digital tools. According to a 2024 evaluation of Sierra Leone's community-based surveillance system, while CHWs are capable of producing actionable data, paper-based reporting and connectivity barriers undermine sustainability [1]. 

Furthermore, a 2026 scoping review of mHealth applications for CHWs found that while 25 of 30 applications used offline-first architecture, 29 of 30 lacked full interoperability with national health systems [2].

## The Solution

VitalLink bridges this gap by providing:
1. **Offline-First Architecture:** Data is saved to the phone's local memory (IndexedDB) first. No internet is required to record a visit.
2. **Automatic Sync:** The moment the phone detects a network connection, the pending records are automatically pushed to the FastAPI backend.
3. **District Dashboard:** A centralized dashboard where health officials can view aggregated patient data and immediately spot unsafe water sources in specific villages.

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript, IndexedDB (Offline Storage)
- **Backend:** Python 3, FastAPI
- **Database:** SQLite (Local Development) / PostgreSQL (Production ready via SQLAlchemy)
- **Deployment Ready:** Designed to be hosted for free on Vercel (Frontend) and Render (Backend).

## How to Run Locally

### 1. Clone the repository
git clone https://github.com/Alusine-bah/vitallink.git
cd vitallink

### 2. Setup the Backend
python -m venv .venv
On Windows: .venv\Scripts\activate
On Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt
uvicorn backend.main:app --reload

The API will be running at http://127.0.0.1:8000.

### 3. Setup the Frontend
Open a second terminal window, navigate to the project folder, and run:
python -m http.server 8080 --directory frontend

Open your browser and go to http://127.0.0.1:8080.

## How to Test the Offline Feature
1. Open the app in your browser.
2. Click the green "Online" badge in the top right corner to simulate offline mode (it will turn red).
3. Fill out a Health Visit or Water Check form and click Save. It is now stored locally.
4. Click the red badge to go back online. Watch the data automatically sync to the backend dashboard.
5. View the dashboard at http://127.0.0.1:8080/dashboard.html

## References
1. Mergenthaler, C., et al. (2024). Feasibility and challenges in sustaining a community based surveillance system in post-Ebola Sierra Leone. Conflict and Health, 18(1), 69.
2. Charoensilpchai, C., et al. (2026). Mobile health (mHealth) applications for community health workers in low- and middle-income countries: A scoping review. International Journal of Medical Informatics, 218, 106531.
