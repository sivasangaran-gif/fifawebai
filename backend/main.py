import asyncio
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db

app = FastAPI(title="StadiumGPT AI Operations API", version="1.0.0")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for AI assistant
class AssistantRequest(BaseModel):
    message: str

# Response model for AI assistant
class AssistantResponse(BaseModel):
    response: str
    timestamp: str

# Background task to simulate live telemetry changes
async def simulate_live_telemetry():
    while True:
        try:
            db = get_db()
            
            # 1. Update KPIs
            kpi_doc = db["kpis"].find_one({"id": "stadium_kpis"})
            if kpi_doc:
                current_attendance = kpi_doc.get("attendance", 74280)
                # Random fluctuations (+/- 15 people)
                current_attendance += random.randint(-15, 20)
                # Clamp between 74000 and 74800
                current_attendance = max(74000, min(current_attendance, 74800))
                
                capacity = kpi_doc.get("capacity", 80000)
                occupancy_rate = round((current_attendance / capacity) * 100, 1)
                
                # Active alerts count
                active_alerts = len(db["alerts"].find({"resolved": False}))
                
                # Format current time
                now_str = datetime.now().strftime("%H:%M:%S")
                
                db["kpis"].update_one(
                    {"id": "stadium_kpis"},
                    {"$set": {
                        "attendance": current_attendance,
                        "occupancyRate": occupancy_rate,
                        "activeAlerts": active_alerts,
                        "currentTime": now_str
                    }}
                )
            
            # 2. Update Gates
            gates = db["gates"].find()
            for gate in gates:
                flow_change = random.randint(-10, 10)
                new_flow = max(40, min(gate.get("flowRate", 100) + flow_change, 350))
                
                occupancy_change = random.randint(-2, 2)
                new_occupancy = max(20, min(gate.get("occupancy", 50) + occupancy_change, 98))
                
                # Determine status
                if new_occupancy < 65:
                    status = "Normal"
                elif new_occupancy < 85:
                    status = "Crowded"
                else:
                    status = "Critical"
                    
                # Wait minutes calculation based on occupancy
                wait_min = int(new_occupancy * 0.25)
                
                db["gates"].update_one(
                    {"id": gate.get("id")},
                    {"$set": {
                        "flowRate": new_flow,
                        "occupancy": new_occupancy,
                        "status": status,
                        "waitMinutes": wait_min
                    }}
                )
            
            # 3. Periodically toggle or add alerts
            # Let's say 10% chance to resolve the traffic delay or add a new minor alert
            alerts = db["alerts"].find()
            # If high alert count is small, simulate new security notification
            if len(alerts) < 6 and random.random() < 0.05:
                new_alert_id = f"alert_{random.randint(100, 999)}"
                categories = ["Crowd", "Transit", "Sustainability", "Security"]
                category = random.choice(categories)
                severity = "Medium" if random.random() > 0.3 else "High"
                
                messages = {
                    "Crowd": "North Deck corridor flow slowing down. Re-routing recommended.",
                    "Transit": "Metro line 2 experiencing high density. Headway adjusted to 1.5 mins.",
                    "Sustainability": "Zone A backup generator testing complete. Power grid balanced.",
                    "Security": "Gate D minor gate-crashing attempt resolved by volunteer team."
                }
                
                db["alerts"].insert_one({
                    "id": new_alert_id,
                    "severity": severity,
                    "category": category,
                    "message": messages[category],
                    "timestamp": datetime.now().strftime("%H:%M:%S"),
                    "resolved": False
                })
                
            # Update metrics history (push current status as latest point and pop oldest)
            # To keep history sizing clean, we'll keep it up to 10 points
            history = db["metricsHistory"].find()
            if history:
                latest_time = datetime.now().strftime("%H:%M")
                
                # Fetch current live numbers for metrics
                kpis = db["kpis"].find_one({"id": "stadium_kpis"})
                density = int(kpis.get("occupancyRate", 92)) if kpis else 92
                
                # Power and water random walk
                last_point = history[-1] if isinstance(history, list) else list(history)[-1]
                new_power = max(300, min(last_point.get("powerDraw", 500) + random.randint(-15, 15), 650))
                new_water = max(150, min(last_point.get("waterFlow", 300) + random.randint(-10, 10), 400))
                new_waste = max(10, min(last_point.get("wasteCapacity", 50) + random.randint(-2, 3), 95))
                
                new_point = {
                    "time": latest_time,
                    "crowdDensity": density,
                    "powerDraw": new_power,
                    "waterFlow": new_water,
                    "wasteCapacity": new_waste
                }
                
                full_history = db["metricsHistory"].find()
                # If we fallback, find() returns list, if MongoDB it returns cursor
                history_list = list(full_history) if not isinstance(full_history, list) else full_history
                history_list.append(new_point)
                if len(history_list) > 10:
                    history_list.pop(0)
                
                # Write back
                if hasattr(db["metricsHistory"], "_write_data"):  # Fallback DB
                    db["metricsHistory"]._write_data(history_list)
                else:  # MongoDB
                    db["metricsHistory"].delete_many({})
                    db["metricsHistory"].insert_many(history_list)

        except Exception as e:
            print(f"Error in background simulator: {e}")
            
        await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    # Start the simulation background task
    asyncio.create_task(simulate_live_telemetry())

@app.get("/api/kpis")
async def get_kpis():
    db = get_db()
    kpi = db["kpis"].find_one({"id": "stadium_kpis"})
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI data not found")
    # Remove Mongo _id for JSON serialization
    if "_id" in kpi:
        kpi["_id"] = str(kpi["_id"])
    return kpi

@app.get("/api/gates")
async def get_gates():
    db = get_db()
    gates = db["gates"].find()
    res = []
    for g in gates:
        if "_id" in g:
            g["_id"] = str(g["_id"])
        res.append(g)
    return res

@app.get("/api/alerts")
async def get_alerts():
    db = get_db()
    alerts = db["alerts"].find()
    res = []
    for a in alerts:
        if "_id" in a:
            a["_id"] = str(a["_id"])
        res.append(a)
    # Sort alerts by timestamp descending, keep unresolved first
    res.sort(key=lambda x: (x.get("resolved", False), x.get("timestamp", "")), reverse=True)
    return res

@app.post("/api/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    db = get_db()
    db["alerts"].update_one({"id": alert_id}, {"$set": {"resolved": True}})
    return {"status": "success", "resolved_id": alert_id}

@app.get("/api/metrics-history")
async def get_metrics_history():
    db = get_db()
    history = db["metricsHistory"].find()
    res = []
    for h in history:
        if "_id" in h:
            h["_id"] = str(h["_id"])
        res.append(h)
    return res

@app.post("/api/assistant", response_model=AssistantResponse)
async def ask_assistant(req: AssistantRequest):
    msg = req.message.lower()
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    # Simple keyword mapping for operations
    if any(k in msg for k in ["crowd", "gate", "density", "capacity", "fan", "people"]):
        db = get_db()
        gates = db["gates"].find()
        critical_gates = [g.get("name", "Unknown Gate") for g in gates if g.get("status") == "Critical"]
        crowded_gates = [g.get("name", "Unknown Gate") for g in gates if g.get("status") == "Crowded"]
        
        gate_status_str = ""
        if critical_gates:
            gate_status_str += f"Gate alert: {', '.join(critical_gates)} are at CRITICAL capacity. "
        if crowded_gates:
            gate_status_str += f"Gates {', '.join(crowded_gates)} are highly crowded. "
            
        response = (
            f"Currently, overall stadium occupancy is at 92.8%. {gate_status_str}"
            "Recommended action: Dynamically reroute incoming spectators from South parking sectors "
            "to Gates A (North) and D (West) which are operating under normal capacity (below 50%)."
        )
    elif any(k in msg for k in ["power", "water", "waste", "sustainability", "energy", "cooling", "electric"]):
        response = (
            "Sustainability grid status: Normal. Power usage is holding steady at 595 kW, water flow "
            "rate is 375 L/s (within optimal cooling thresholds), and waste processing capacity is at 82%. "
            "The minor power spike in Section 204 was mitigated by triggering automated low-power cooling cycles."
        )
    elif any(k in msg for k in ["transit", "shuttle", "bus", "metro", "parking", "taxi", "traffic"]):
        response = (
            "Transportation system status updates: Metro line is running smoothly with heavy loads (headway: 1.5 mins). "
            "Shuttle Bus Route 4 is delayed by 10 minutes near the east intersection. Recommend dispatching 2 reserve shuttles "
            "via the secondary bypass lane. Taxi/Ride-sharing queues in Zone 1 are normal."
        )
    elif any(k in msg for k in ["weather", "temperature", "forecast", "rain"]):
        response = (
            "Current stadium weather is 24°C and clear. Humidity is at 55%. The roof remains open, "
            "and wind speed is calm at 8 km/h. No precipitation is forecast for the remainder of the tournament window."
        )
    elif any(k in msg for k in ["security", "package", "police", "incident"]):
        response = (
            "Operations Alert: The unattended package reported near Gate B at 19:30 has been fully cleared and resolved "
            "by the ground security team. All sectors are currently green. CCTV tracking is actively monitoring flow."
        )
    elif any(k in msg for k in ["volunteer", "staff", "copilot", "people", "help"]):
        response = (
            "Volunteer Copilot active. We have 140 active volunteers deployed across gates and transit links. "
            "There are 15 floaters available in the North Deck if you need to dispatch support to Gate C or shuttle queues."
        )
    else:
        response = (
            "StadiumGPT AI assistant active. I am tracking all telemetry systems for the FIFA World Cup 2026. "
            "Ask me about crowd density, gate capacity bottlenecks, transit/shuttle delays, energy management, "
            "or active alerts."
        )
        
    return AssistantResponse(response=response, timestamp=timestamp)
