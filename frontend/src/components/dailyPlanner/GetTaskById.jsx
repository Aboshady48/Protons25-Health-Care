// components/dailyPlanner/GetTaskById.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../Style/GetTaskById.css";

export const GetTaskById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Map priority numbers to readable labels + CSS classes
  const getPriorityLabel = (priority) => {
    const map = {
      1: "Very Low",
      2: "Low",
      3: "Medium",
      4: "High",
      5: "Very High",
    };
    return map[priority] || `Priority ${priority}`;
  };

  const getPriorityClass = (priority) => {
    const map = {
      1: "priority-low",
      2: "priority-low",
      3: "priority-medium",
      4: "priority-high",
      5: "priority-high",
    };
    return map[priority] || "priority-medium";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `http://localhost:5000/api/tasks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
        if (error.response?.status === 404) {
          setError("Task not found");
        } else {
          setError(
            error.response?.data?.error ||
              error.response?.data?.message ||
              "Failed to fetch task"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleBackClick = () => navigate("/");
  const handleEditClick = () => navigate(`/tasks/${id}/edit`);
  const handleRetry = () => window.location.reload();
  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleDeleteCancel = () => setShowDeleteModal(false);

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in first.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("Task deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error);
      alert("Error deleting task. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="task-loading">
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
      <div className="task-error">
        <div className="error-container">
          <h2>Error loading task</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="btn retry-btn">
              Try Again
            </button>
            <button onClick={handleBackClick} className="btn back-btn">
              ← Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-not-found">
        <div className="not-found-container">
          <h2>Task not found</h2>
          <p>The task you're looking for doesn't exist or has been deleted.</p>
          <button onClick={handleBackClick} className="btn back-btn">
            ← Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="GetTaskById-container">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>⚠️ Delete Task</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this task?</p>
              <p className="task-title-preview">"{task.title}"</p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button
                onClick={handleDeleteCancel}
                className="btn cancel-btn"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn danger-btn"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="task-header">
        <h1>{task.title}</h1>
        <span className="task-id">Task ID: {id}</span>
        {task.created_at && (
          <span className="task-date">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="task-content">
        {task.description && (
          <>
            <h3>Description:</h3>
            <p className="task-description">{task.description}</p>
          </>
        )}

        {/* ✅ Completed Field */}
        {"completed" in task && (
          <div className="task-completed">
            <strong>Completed:</strong>
            <span
              className={task.completed ? "status-completed" : "status-pending"}
            >
              {task.completed ? "✅ Yes" : "❌ No"}
            </span>
          </div>
        )}

        {/* ✅ Status */}
        {task.status && (
          <div className="task-status">
            <strong>Status:</strong>
            <span className={`status-${String(task.status).toLowerCase()}`}>
              {task.status}
            </span>
          </div>
        )}

        {/* ✅ Priority (mapped) */}
        {task.priority && (
          <div className="task-priority">
            <strong>Priority:</strong>
            <span className={getPriorityClass(task.priority)}>
              {getPriorityLabel(task.priority)}
            </span>
          </div>
        )}

        {task.due_date && (
          <div className="task-due-date">
            <strong>Due Date:</strong>
            <span className="due-date">
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="task-footer">
        <button className="btn back-btn" onClick={handleBackClick}>
          ← Return to All Tasks
        </button>
        <div className="footer-actions">
          <button className="btn edit-btn" onClick={handleEditClick}>
            ✏️ Edit Task
          </button>
          <button className="btn danger-btn" onClick={handleDeleteClick}>
            🗑️ Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
