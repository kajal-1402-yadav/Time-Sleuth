from fastapi import FastAPI
from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# load env variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# Root route
@app.get("/")
def root():
    return {"message": "Time Sleuth API running 🚀"}


# 🔥 ANALYSIS ENDPOINT
@app.get("/analyze/{user_id}")
def analyze(user_id: str):
    today = datetime.utcnow().date().isoformat()

    # Fetch activity logs
    response = (
        supabase.table("activity_logs")
        .select("*")
        .eq("user_id", user_id)
        .gte("timestamp", today)
        .execute()
    )

    logs = response.data

    if not logs:
        return {"message": "No activity data found"}

    total_idle = 0
    total_activity = 0

    idle_streak = 0
    max_idle_streak = 0
    spike_detected = False

    # Analyze logs
    for i, log in enumerate(logs):
        activity = (
            log["mouse_moves"]
            + log["clicks"]
            + log["keystrokes"]
        )

        total_activity += activity
        total_idle += log["idle_time"]

        # idle streak
        if log["idle_time"] > 10:
            idle_streak += 1
            max_idle_streak = max(max_idle_streak, idle_streak)
        else:
            idle_streak = 0

        # spike detection
        if (
            i > 0
            and logs[i - 1]["idle_time"] > 10
            and activity > 200
        ):
            spike_detected = True

    # scoring
    score = (
        total_idle * 1.5
        + max_idle_streak * 10
        + (20 if spike_detected else 0)
        - total_activity * 0.05
    )

    score = max(0, min(100, round(score)))

    # reasoning
    reason = "Normal activity pattern"

    if spike_detected:
        reason = "Suspicious spike after idle detected"
    elif max_idle_streak >= 3:
        reason = "Repeated long idle periods"
    elif total_idle > 60:
        reason = "High overall idle time"
    elif score > 40:
        reason = "Moderate inconsistency in activity"

    # result
    result = {
        "user_id": user_id,
        "date": today,
        "suspicion_score": score,
        "anomaly_flag": score > 60,
        "reason": reason,
    }

    # Save result
    supabase.table("analysis_results").upsert(
        result,
        on_conflict="user_id,date"
    ).execute()

    return result