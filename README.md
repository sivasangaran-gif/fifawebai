# StadiumGPT AI - FIFA World Cup 2026 Dashboard

StadiumGPT AI is a premium, futuristic SaaS operations dashboard built custom for the FIFA World Cup 2026. This interface displays real-time telemetry metrics, crowd heatmap sensors, AI-guided navigation feeds, public transport schedules, operations alerts, and chat copilot panels.

## 🚀 Minimal File Structure
```stadiumgpt-ai/
├── assets/
│   ├── images/
│   │   └── trophy.png  (Golden trophy design asset)
│   └── icons/
│       └── (Custom inline SVGs / Lucide CDNs are used for icons)
├── index.html          (SaaS dashboard DOM nodes & layouts)
├── styles.css          (Glassmorphism layouts & animations)
├── script.js           (Real-time charts, telemetry ticker, chatbots, alerts feeds)
└── README.md
```

## 🛠️ Key Interactive Features
1. **Interactive Stadium Heatmap**: A top-down vector stadium stands model with dynamic hover states. Clicking any gate (A to E) inspects that gate's crowd flow telemetry metrics and updates stats locally in real time. Includes Zoom and Fullscreen modes.
2. **Real-time Live Ticker**: Telemetry metrics (Crowd density, Power Draw, Water Flow, Waste capacity) and attendance indicators fluctuate slightly every 4 seconds to simulate a live match operations environment.
3. **Multilingual AI Assistant**: An interactive chatbot panel supporting English, Español, Français, Arabic (العربية), and Japanese (日本語). Toggling the language selector translates the chatbot greetings, chat input placeholder, and voice transcription inputs.
4. **Operations Alerts Feed**: A high-priority stream showing warning badges. Selecting "View All" slides out an operations history log panel. Users can add new incidents from the Volunteer AI Copilot search and clear log arrays.
5. **Volunteer AI Copilot**: Prompts and quick-action buttons designed for staff coordination. Selecting quick prompts pre-fills the search query and fires simulated answers instantly.

## 💻 How to Run Locally
There are no installation steps or compilation builds needed:
1. **Option A (Direct File opening)**: Just double-click the `index.html` file in your file explorer to open it in Google Chrome, Microsoft Edge, Firefox, or Safari.
2. **Option B (Local Dev Server)**: Open a terminal inside the project directory and run a lightweight server:
   - Python: `python -m http.server 8000`
   - Node.js (via static-server or live-server): `npx live-server`
   Then open `http://localhost:8000` (or the port specified) in your browser.
