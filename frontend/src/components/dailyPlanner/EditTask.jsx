import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Style/EditTas.css";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/tasks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
        setPriority(response.data.priority || 1);
        setCompleted(response.data.completed || false);
      } catch (error) {
        console.error("Error fetching task:", error.response?.data || error.message);
        setError(
          error.response?.status === 404
            ? "Task not found"
            : error.response?.data?.error || "Failed to fetch task"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, navigate]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in first!");
        navigate("/login");
        return;
      }

      if (!title.trim()) {
        alert("Title is required!");
        setSaving(false);
        return;
      }

      const body = {
        title: title.trim(),
        description: description.trim(),
        priority,
        completed,
      };

      await axios.put(`http://localhost:5000/api/tasks/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("Task updated successfully!");
      navigate("/tasks/all");
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/tasks/all");

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

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            className={`todo-input priority-${priority}`}
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          >
            <option value={1}>Priority 1 (Lowest)</option>
            <option value={2}>Priority 2</option>
            <option value={3}>Priority 3</option>
            <option value={4}>Priority 4</option>
            <option value={5}>Priority 5 (Highest)</option>
          </select>
        </div>

        <div className="form-group">
          <label className={`completed-label ${completed ? "done" : "pending"}`}>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            {completed ? "✅ Task Completed" : "❌ Not Completed"}
          </label>
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
