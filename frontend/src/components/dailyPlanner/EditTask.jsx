// components/dailyPlanner/EditTask.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../../Style/EditTas.css"; // Make sure this CSS file exists

const EditTask = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch task data on component mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please log in first.");
          navigate('/login');
          return;
        }

        // Use GET to fetch task data, not PUT
        const response = await axios.get(
          `http://localhost:5000/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Set the task data
        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
      } catch (error) {
        console.error("Error fetching task:", error.response?.data || error.message);
        if (error.response?.status === 404) {
          setError("Task not found");
        } else {
          setError(error.response?.data?.error || "Failed to fetch task");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, navigate]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in first!");
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!title.trim()) {
        alert("Title is required!");
        setSaving(false);
        return;
      }

      const body = { 
        title: title.trim(),
        description: description.trim()
      };

      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      alert("Task updated successfully!");
      navigate("/"); // Navigate back to tasks list
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        setError("Task not found");
      } else {
        setError(error.response?.data?.message || "Failed to update task");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="edit-task-loading">
        <div className="loading-container">
          <h2>Loading task...</h2>
          <p>Please wait while we fetch the task details.</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="edit-task-error">
        <div className="error-container">
          <h2>Error loading task</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleCancel} className="cancel-btn">
              ← Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="EditTask-container">
      <div className="edit-task-header">
      
        <h2>Edit Task #{id}</h2>
      </div>

      <form onSubmit={onSubmitForm} className="EditTask-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            className="todo-input todo-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            placeholder="Edit your task description"
            className="todo-input todo-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="update-btn"
            disabled={saving || !title.trim()}
          >
            {saving ? "Saving..." : "Update Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;