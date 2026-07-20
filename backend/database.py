import os
import json
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

# Path for the JSON database fallback
FALLBACK_DB_PATH = os.path.join(os.path.dirname(__file__), "data", "db_fallback.json")

# Initial mock data to seed the database
SEED_DATA = {
    "kpis": [
        {
            "id": "stadium_kpis",
            "matchStatus": "LIVE - 68'",
            "attendance": 74280,
            "capacity": 80000,
            "occupancyRate": 92.8,
            "activeAlerts": 3,
            "weather": "24°C, Clear",
            "currentTime": "20:20:15"
        }
    ],
    "gates": [
        {"id": "gate_a", "name": "Gate A (North)", "status": "Normal", "occupancy": 45, "flowRate": 120, "waitMinutes": 4},
        {"id": "gate_b", "name": "Gate B (East)", "status": "Crowded", "occupancy": 78, "flowRate": 210, "waitMinutes": 12},
        {"id": "gate_c", "name": "Gate C (South)", "status": "Critical", "occupancy": 92, "flowRate": 310, "waitMinutes": 22},
        {"id": "gate_d", "name": "Gate D (West)", "status": "Normal", "occupancy": 30, "flowRate": 80, "waitMinutes": 2},
        {"id": "gate_e", "name": "Gate E (VIP)", "status": "Crowded", "occupancy": 82, "flowRate": 240, "waitMinutes": 15}
    ],
    "alerts": [
        {
            "id": "alert_1",
            "severity": "High",
            "category": "Crowd",
            "message": "Gate C crowd density exceeded 90% capacity. Dispatching volunteer team.",
            "timestamp": "20:00:15",
            "resolved": False
        },
        {
            "id": "alert_2",
            "severity": "Medium",
            "category": "Transit",
            "message": "Shuttle Bus Route 4 experiencing 10-minute delay due to traffic.",
            "timestamp": "19:48:30",
            "resolved": False
        },
        {
            "id": "alert_3",
            "severity": "Medium",
            "category": "Sustainability",
            "message": "Section 204 power usage spike detected. Cooling systems adjusting.",
            "timestamp": "19:42:10",
            "resolved": False
        },
        {
            "id": "alert_4",
            "severity": "High",
            "category": "Security",
            "message": "Unattended package reported near Gate B. Security unit en route.",
            "timestamp": "19:30:00",
            "resolved": True
        }
    ],
    "metricsHistory": [
        # Historical stats for Recharts (past 10 half-hour intervals)
        {"time": "18:00", "crowdDensity": 40, "powerDraw": 340, "waterFlow": 180, "wasteCapacity": 25},
        {"time": "18:30", "crowdDensity": 55, "powerDraw": 390, "waterFlow": 220, "wasteCapacity": 30},
        {"time": "19:00", "crowdDensity": 70, "powerDraw": 450, "waterFlow": 290, "wasteCapacity": 40},
        {"time": "19:30", "crowdDensity": 82, "powerDraw": 520, "waterFlow": 310, "wasteCapacity": 55},
        {"time": "20:00", "crowdDensity": 91, "powerDraw": 580, "waterFlow": 350, "wasteCapacity": 70},
        {"time": "20:30", "crowdDensity": 93, "powerDraw": 595, "waterFlow": 375, "wasteCapacity": 82}
    ]
}

class JSONCollectionFallback:
    def __init__(self, db_path, collection_name, default_data):
        self.db_path = db_path
        self.collection_name = collection_name
        self.default_data = default_data
        self._ensure_file()

    def _ensure_file(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.db_path):
            with open(self.db_path, "w") as f:
                json.dump({}, f)
        
        with open(self.db_path, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}
        
        if self.collection_name not in data:
            data[self.collection_name] = self.default_data
            with open(self.db_path, "w") as f:
                json.dump(data, f, indent=2)

    def _read_data(self):
        with open(self.db_path, "r") as f:
            return json.load(f).get(self.collection_name, [])

    def _write_data(self, data):
        with open(self.db_path, "r") as f:
            full_data = json.load(f)
        full_data[self.collection_name] = data
        with open(self.db_path, "w") as f:
            json.dump(full_data, f, indent=2)

    def find(self, query=None):
        data = self._read_data()
        if not query:
            return data
        
        results = []
        for doc in data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
        return results

    def find_one(self, query=None):
        results = self.find(query)
        return results[0] if results else None

    def update_one(self, query, update):
        data = self._read_data()
        updated = False
        set_dict = update.get("$set", {})
        
        for doc in data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                for uk, uv in set_dict.items():
                    doc[uk] = uv
                updated = True
                break
        
        if updated:
            self._write_data(data)
        return updated

    def insert_one(self, doc):
        data = self._read_data()
        data.append(doc)
        self._write_data(data)
        return doc

class JSONDatabaseFallback:
    def __init__(self, db_path, seed_data):
        self.db_path = db_path
        self.seed_data = seed_data
        self.collections = {}
        for col_name, default in seed_data.items():
            self.collections[col_name] = JSONCollectionFallback(db_path, col_name, default)

    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = JSONCollectionFallback(self.db_path, name, [])
        return self.collections[name]

# Attempt to connect to MongoDB
db = None
is_mongo_fallback = True

try:
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
    # Check connection
    client.server_info()
    db = client["stadium_ops"]
    is_mongo_fallback = False
    print("Successfully connected to MongoDB.")
    
    # Seed MongoDB if empty
    for col_name, seed in SEED_DATA.items():
        if db[col_name].count_documents({}) == 0:
            db[col_name].insert_many(seed)
            print(f"Seeded MongoDB collection '{col_name}'.")

except (ServerSelectionTimeoutError, ConnectionFailure, Exception) as e:
    print(f"Failed to connect to MongoDB ({e}). Falling back to JSON database file: {FALLBACK_DB_PATH}")
    db = JSONDatabaseFallback(FALLBACK_DB_PATH, SEED_DATA)
    is_mongo_fallback = True

def get_db():
    return db
