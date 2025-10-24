import React, { useState, useEffect } from "react";
import axios from "axios";
import SmartAddTask from "./SmartAddTask"; // Updated import
import GetAllTasks from "./dailyPlanner/GetAllTasks";

const IntegratedPlanner = ({ assessment, moodResult, bioResult, onBack }) => {
  const [smartRecommendations, setSmartRecommendations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assessment) {
      generateSmartRecommendations();
      fetchSmartTasks();
    }
  }, [assessment]);

  const generateSmartRecommendations = () => {
    const recs = [];
    
    if (assessment.energyLevel === "high") {
      recs.push({
        type: "priority",
        message: "Focus on high-priority tasks today",
        priorityRange: [3, 4, 5]
      });
    } else {
      recs.push({
        type: "priority", 
        message: "Stick to low-medium priority tasks",
        priorityRange: [1, 2, 3]
      });
    }

    if (moodResult.mood === "Stressed" || moodResult.mood === "Anxious") {
      recs.push({
        type: "breaks",
        message: "Schedule regular breaks and limit task count"
      });
    }

    if (bioResult === "creative") {
      recs.push({
        type: "creative",
        message: "Perfect for brainstorming and creative work"
      });
    }

    setSmartRecommendations(recs);
  };

  const fetchSmartTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/tasks/smart",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            mood: moodResult?.mood,
            biorhythm: bioResult,
            energy_level: assessment?.energyLevel
          }
        }
      );
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching smart tasks:", error);
    }
  };

  const createSmartTask = (recommendation) => {
    const smartTask = {
      title: `Smart Task: ${recommendation.message}`,
      description: generateTaskDescription(recommendation),
      priority: getSmartPriority(recommendation),
      suggestedTime: getSuggestedTime(assessment)
    };
    
    localStorage.setItem("smartTaskDraft", JSON.stringify(smartTask));
  };

  const getSmartPriority = (rec) => {
    if (assessment.energyLevel === "high") return 4;
    if (rec.type === "priority" && rec.priorityRange) {
      return rec.priorityRange[0];
    }
    return 2;
  };

  const generateTaskDescription = (rec) => {
    const baseDesc = `Auto-generated based on your ${moodResult.mood} mood and ${bioResult} biorhythm.\n`;
    return baseDesc + rec.message;
  };

  const getSuggestedTime = (assessment) => {
    if (assessment.energyLevel === "high") return "Morning - High energy period";
    return "Afternoon - After rest period";
  };

  return (
    <div className="integrated-planner">
      <div className="planner-header">
        <button className="back-btn" onClick={onBack}>← Back to Results</button>
        <h1>Smart Daily Planner</h1>
        <p>Tasks optimized for your current {moodResult.mood} mood and {bioResult} biorhythm</p>
      </div>

      {smartRecommendations.length > 0 && (
        <div className="smart-recommendations">
          <h3>📊 Today's Smart Recommendations</h3>
          {smartRecommendations.map((rec, index) => (
            <div key={index} className={`rec-card ${rec.type}`}>
              <h4>{rec.message}</h4>
              {rec.type === "priority" && (
                <p>Recommended Priority: {rec.priorityRange?.join("-")}</p>
              )}
              <button 
                className="create-smart-task-btn"
                onClick={() => createSmartTask(rec)}
              >
                Create Smart Task
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="energy-indicators">
        <div className={`energy-bar ${assessment?.energyLevel}`}>
          <span>Energy Level: {assessment?.energyLevel}</span>
          <div className="bar-fill"></div>
        </div>
        <div className="focus-score">
          Focus Score: {calculateFocusScore(assessment)}/100
        </div>
      </div>

      <div className="smart-tasks-section">
        <div className="tasks-header">
          <h3>Optimized Task List</h3>
          <SmartAddTask // Updated component
            smartMode={true}
            assessment={assessment}
            moodResult={moodResult}
            bioResult={bioResult}
          />
        </div>
        
        <GetAllTasks 
          smartFilter={assessment}
          highlightSmartTasks={true}
          tasks={tasks.length > 0 ? tasks : undefined}
        />
      </div>

      <div className="quick-actions">
        <button 
          className="quick-btn energy-btn"
          onClick={() => createSmartTask({type: "energy", message: "Energy boost task"})}
        >
          💪 Energy Task
        </button>
        <button 
          className="quick-btn focus-btn"
          onClick={() => createSmartTask({type: "focus", message: "Focus session"})}
        >
          🎯 Focus Session
        </button>
        <button 
          className="quick-btn break-btn"
          onClick={() => createSmartTask({type: "break", message: "Scheduled break"})}
        >
          ⏸️ Take Break
        </button>
      </div>
    </div>
  );
};

const calculateFocusScore = (assessment) => {
  let score = 50;
  if (assessment?.energyLevel === "high") score += 30;
  if (assessment?.stressLevel === "low") score += 20;
  return Math.min(score, 100);
};

export default IntegratedPlanner;