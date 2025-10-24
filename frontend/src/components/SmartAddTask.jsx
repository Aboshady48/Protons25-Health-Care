import React, { useState, useEffect } from "react";
import AddTask from "./dailyPlanner/AddTask";

const SmartAddTask = ({ assessment, smartMode = false }) => {
  const [draft, setDraft] = useState(null);
  const [autoSuggestions, setAutoSuggestions] = useState([]);

  useEffect(() => {
    if (smartMode && assessment) {
      loadSmartDraft();
      generateAutoSuggestions();
    }
  }, [assessment, smartMode]);

  const loadSmartDraft = () => {
    const savedDraft = localStorage.getItem("smartTaskDraft");
    if (savedDraft) {
      setDraft(JSON.parse(savedDraft));
      localStorage.removeItem("smartTaskDraft");
    }
  };

  const generateAutoSuggestions = () => {
    const suggestions = [];
    
    if (assessment?.energyLevel === "high") {
      suggestions.push("High-impact project", "Creative brainstorming", "Important meetings");
    }
    
    if (assessment?.suggestedActivities) {
      suggestions.push(...assessment.suggestedActivities.slice(0, 3));
    }
    
    setAutoSuggestions(suggestions);
  };

  const handleQuickSuggestion = (suggestion) => {
    setDraft(prev => ({
      ...prev,
      title: `Smart: ${suggestion}`,
      description: `Generated for your current wellness state (${assessment?.energyLevel} energy)`
    }));
  };

  return (
    <div className="smart-add-task">
      {smartMode && (
        <div className="smart-header">
          <h3>🧠 Smart Task Creator</h3>
          <p>Auto-optimized for your current state</p>
          
          {autoSuggestions.length > 0 && (
            <div className="quick-suggestions">
              <p>Quick starts:</p>
              {autoSuggestions.map((suggestion, i) => (
                <button 
                  key={i}
                  className="suggestion-btn"
                  onClick={() => handleQuickSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <AddTask 
        initialData={draft}
        smartSuggestions={autoSuggestions}
        assessment={assessment}
      />
    </div>
  );
};

export default SmartAddTask;