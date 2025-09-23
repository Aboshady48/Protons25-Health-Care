import React, { useState } from "react";
import axios from "axios";
import '../../Style/AddTask.css'

const AddTask = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(1); // default priority = 1
  const [completed, setCompleted] = useState(false); // default not completed

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in first!");
        return;
      }

      // Wrap single task in an array (backend expects array)
      const body = [
        {
          title,
          description,
          priority,
          completed,
        },
      ];

      const response = await axios.post(
        "http://localhost:5000/api/tasks/add",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Task added:", response.data);
      alert("✅ Task added successfully!");
      
      // Reset form
      setDescription("");
      setTitle("");
      setPriority(1);
      setCompleted(false);

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <div className="AddTask-container">
      <h1 className="AddTask-title">
        Daily Planner
        <span>Add Task</span>
      </h1>

      <form className="AddTask-form" onSubmit={onSubmitForm}>
        {/* Title input */}
        <input
          type="text"
          placeholder="Enter title"
          className="AddText-input AddText-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description input */}
        <input
          type="text"
          placeholder="Add Your Task Description"
          className="AddText-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            marginBottom: "10px",
            width: "270px",
            height: "100px",
            color: "#2c3e50",
            borderRadius: "8px",
          }}
        />

        {/* Priority select */}
        <select
          className="AddText-input"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          style={{
            marginBottom: "10px",
            color: "#2c3e50",
            backgroundColor: "#93da97",
          }}
        >
          <option value={1}>Priority 1 (Lowest)</option>
          <option value={2}>Priority 2</option>
          <option value={3}>Priority 3</option>
          <option value={4}>Priority 4</option>
          <option value={5}>Priority 5 (Highest)</option>
        </select>

        {/* Completed checkbox */}
        <label className="AddTask-checkbox">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Mark as Completed
        </label>

        {/* Submit button */}
        <button type="submit" className="AddTask-button">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
