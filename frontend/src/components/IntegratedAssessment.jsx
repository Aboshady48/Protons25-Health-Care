import React, { useState, useEffect } from "react";
import axios from "axios";
import MoodTracker from "./Tracker/MoodTracker"; // Assume updated to support onComplete
import Biorhythm from "./Tracker/Biorhythm"; // Assume updated to support onComplete
import IntegratedPlanner from "./IntegratedPlanner";

const IntegratedAssessment = () => {
  const [step, setStep] = useState("mood"); // "mood", "biorhythm", "results", "planner"
  const [moodResult, setMoodResult] = useState(null);
  const [bioResult, setBioResult] = useState(null);
  const [combinedAssessment, setCombinedAssessment] = useState(null);
  const [showPlanner, setShowPlanner] = useState(false);

  // Handle mood result
  const handleMoodComplete = (result) => {
    setMoodResult(result);
    setStep("biorhythm");
  };

  // Handle biorhythm result  
  const handleBioComplete = (result) => {
    setBioResult(result);
    analyzeCombinedResults(result);
  };

  // Analyze combined results and generate recommendations
  const analyzeCombinedResults = async (bioResult) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/assessment/combined",
        {
          mood: moodResult,
          biorhythm: bioResult,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCombinedAssessment(response.data);
      setStep("results");
      setShowPlanner(true);
    } catch (error) {
      console.error("Error analyzing results:", error);
      // Fallback analysis
      const fallbackAnalysis = generateFallbackAnalysis(moodResult, bioResult);
      setCombinedAssessment(fallbackAnalysis);
      setStep("results");
      setShowPlanner(true);
    }
  };

  // Fallback analysis without backend
  const generateFallbackAnalysis = (mood, bio) => {
    const recommendations = {
      energyLevel: mood.mood === "Happy" || mood.mood === "Excited" ? "high" : "low",
      focusLevel: bio === "creative" ? "high" : "moderate",
      stressLevel: mood.mood === "Stressed" || mood.mood === "Anxious" ? "high" : "low",
      suggestedActivities: getSuggestedActivities(mood.mood, bio),
      taskPrioritization: getTaskPrioritization(mood, bio)
    };
    
    return recommendations;
  };

  const getSuggestedActivities = (mood, bio) => {
    const activities = [];
    
    if (mood === "Happy" || mood === "Excited") {
      activities.push("Take on challenging tasks", "Creative projects", "Social interactions");
    }
    
    if (mood === "Stressed" || mood === "Sad") {
      activities.push("Light tasks", "Breaks and mindfulness", "Routine work");
    }
    
    if (bio === "creative") {
      activities.push("Brainstorming", "Design work", "Writing");
    } else if (bio === "analytical") {
      activities.push("Data analysis", "Problem-solving", "Planning");
    }
    
    return activities;
  };

  const getTaskPrioritization = (mood, bio) => {
    if (mood.mood === "Anxious" || mood.sleep_quality < 3) {
      return "low"; // Focus on fewer, important tasks
    }
    return "high"; // Can handle more tasks
  };

  const getPlanningInstructions = (assessment, mood, bio) => {
    let instructions = "Based on your current mood and biorhythm, here are some tips on when to create your daily plan:\n\n";

    if (assessment.energyLevel === "high") {
      instructions += "- With high energy, plan right now or early in the morning when your focus is sharpest for optimal productivity.\n";
    } else {
      instructions += "- With lower energy, consider planning after a short break or in the late morning/afternoon when you might feel more refreshed. Avoid post-lunch dips.\n";
    }

    if (assessment.stressLevel === "high") {
      instructions += "- If feeling stressed or anxious, start with a quick mindfulness break before planning to clear your mind.\n";
    }

    if (assessment.focusLevel === "high") {
      instructions += "- Your high focus level suggests planning during peak alertness periods, typically mid-morning.\n";
    } else {
      instructions += "- For moderate focus, schedule planning when you feel most alert, perhaps after a coffee break.\n";
    }

    if (bio === "creative") {
      instructions += "- As a creative profile, plan in the morning to harness inspiration and ideas effectively.\n";
    } else if (bio === "analytical") {
      instructions += "- For an analytical profile, plan in the late morning when logical thinking peaks.\n";
    }

    instructions += "\nRemember to track your energy patterns over a few days to personalize these timings further.";

    return instructions;
  };

  const restartAssessment = () => {
    setStep("mood");
    setMoodResult(null);
    setBioResult(null);
    setCombinedAssessment(null);
  };

  const skipToPlanner = () => {
    setStep("planner");
    setShowPlanner(true);
  };

  return (
    <div className="integrated-assessment">
      <div className="assessment-header">
        <h1>Daily Wellness Assessment</h1>
        <p>Complete both assessments to get personalized planning recommendations</p>
        
        <div className="progress-bar">
          <div className={`progress-fill ${step}`}></div>
          <div className="progress-steps">
            <span className={step === "mood" ? "active" : ""}>Mood</span>
            <span className={step === "biorhythm" ? "active" : ""}>Biorhythm</span>
            <span className={step === "results" ? "active" : ""}>Results</span>
            <span className={step === "planner" ? "active" : ""}>Plan</span>
          </div>
        </div>
      </div>

      <div className="assessment-content">
        {step === "mood" && (
          <MoodTracker 
            onComplete={handleMoodComplete}
            showBackButton={false}
          />
        )}

        {step === "biorhythm" && (
          <div className="step-content">
            <button className="back-btn" onClick={() => setStep("mood")}>
              ← Back to Mood
            </button>
            <Biorhythm onComplete={handleBioComplete} />
          </div>
        )}

        {step === "results" && combinedAssessment && (
          <div className="results-step">
            <h2>Your Daily Assessment</h2>
            
            <div className="assessment-summary">
              <div className="mood-result">
                <h3>Mood: {moodResult.mood}</h3>
                <p>Sleep Quality: {moodResult.sleep_quality}/5</p>
                <p>Safety Level: {moodResult.safety_level}/5</p>
              </div>
              
              <div className="bio-result">
                <h3>Biorhythm: {bioResult}</h3>
                {/* Add more bio details when available */}
              </div>
            </div>

            <div className="recommendations">
              <h3>Today's Recommendations</h3>
              <div className="rec-card">
                <h4>Energy Level: {combinedAssessment.energyLevel}</h4>
                <p>{combinedAssessment.energyLevel === "high" ? 
                  "Great day for important tasks!" : 
                  "Consider lighter workload today"
                }</p>
              </div>
              
              <div className="rec-card">
                <h4>Suggested Focus</h4>
                <ul>
                  {combinedAssessment.suggestedActivities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>

              <div className="rec-card planning-instructions">
                <h4>Planning Instructions</h4>
                <p style={{whiteSpace: 'pre-line'}}>{getPlanningInstructions(combinedAssessment, moodResult, bioResult)}</p>
              </div>
              
              {showPlanner && (
                <div className="action-buttons">
                  <button 
                    className="primary-btn" 
                    onClick={() => setStep("planner")}
                  >
                    Open Smart Planner →
                  </button>
                  <button 
                    className="secondary-btn" 
                    onClick={skipToPlanner}
                  >
                    Skip to Regular Planner
                  </button>
                </div>
              )}
            </div>

            <button className="restart-btn" onClick={restartAssessment}>
              Restart Assessment
            </button>
          </div>
        )}

        {step === "planner" && showPlanner && (
          <IntegratedPlanner 
            assessment={combinedAssessment}
            moodResult={moodResult}
            bioResult={bioResult}
            onBack={() => setStep("results")}
          />
        )}
      </div>
    </div>
  );
};

export default IntegratedAssessment;

// Note: To make this work, update MoodTracker.jsx and Biorhythm.jsx to support onComplete prop.
// In MoodTracker handleSubmit, after setResult(res.data.mood), add: if (props.onComplete) props.onComplete(res.data.mood);
// In Biorhythm submitResults, after setResult(topProfile), add: if (props.onComplete) props.onComplete(topProfile);
// Also import the CSS file as shown.