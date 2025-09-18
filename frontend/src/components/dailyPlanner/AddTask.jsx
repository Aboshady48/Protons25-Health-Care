import React, { useState } from "react";
import axios from "axios";
import '../../Style/AddTask.css'

const AddTask = () => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      // ✅ Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in first!");
        return;
      }

      //  Wrap single task in an array (backend expects array)
      const body = [
        {
          title,
          description,
        },
      ];

      const response = await axios.post(
        "http://localhost:5000/api/tasks/add",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`, //  send token
          },
          withCredentials: true,
        }
      );

      console.log("Task added:", response.data);
      setDescription("");
      setTitle("");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add task");
    }
  };

  return (
    <div className="AddTask-container">
      <h1 className="AddTask-title">
        Daily Planner
        <span> Add Task </span>
      </h1>

      <form className="AddTask-form" onSubmit={onSubmitForm}>
        <input
          type="text"
          placeholder="Enter title"
          className="AddText-input AddText-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Add Your Task"
          className="AddText-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="AddTask-button">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
