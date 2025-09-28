// components/dailyPlanner/GetAllTasks.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Style/GetAllTasks.css";

const GetAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;
  const navigate = useNavigate();

  const getAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in first.");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/tasks/all", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setTasks((response.data.tasks || []).reverse());
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
    }
  };

  // Handle view task click
  const handleViewTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  // Handle edit task click
  const handleEditTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  useEffect(() => {
    getAllData();
    const interval = setInterval(getAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // Map priority to color + label
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 5:
        return "priority-highest";
      case 4:
        return "priority-high";
      case 3:
        return "priority-medium";
      case 2:
        return "priority-low";
      default:
        return "priority-lowest";
    }
  };

  return (
    <div className="GetAllTasks-container">
      <h2>All Tasks</h2>
      <ul>
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-preview">
                <div className="task-header">
                  <strong className="task-title">{task.title}</strong>
                  <span className="task-id">#{task.id}</span>
                </div>

                {task.description && (
                  <p className="task-description-preview">
                    {task.description.length > 50
                      ? `${task.description.substring(0, 50)}...`
                      : task.description}
                  </p>
                )}

                {/* NEW: Priority + Completed badges */}
                <div className="task-meta">
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    Priority {task.priority}
                  </span>
                  <span
                    className={`status-badge ${
                      task.completed ? "completed" : "pending"
                    }`}
                  >
                    {task.completed ? "Completed ✅" : "Pending ⏳"}
                  </span>
                </div>

                <div className="task-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewTaskClick(task.id)}
                    title="View details"
                  >
                    View Details →
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditTaskClick(task.id)}
                    title="Edit task"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="pagination-btn left-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          title="Previous page"
        >
          ←
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="pagination-btn right-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default GetAllTasks;
