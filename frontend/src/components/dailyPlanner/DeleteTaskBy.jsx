import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import '../../Style/DeleteTask.css'

export const DeleteTasks = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in first.");
        setMessage("⚠️ You must log in first!");
        return;
      }

      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setMessage("✅ Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
      setMessage("❌ Error deleting task");
    }
  };

  return (
    <div>
      <h2>Delete Task</h2>

      {/* زرار يفتح المودال */}
      <button className="delete-btn" onClick={() => setShowModal(true)}>
        Delete Task
      </button>

      {/* رسالة بعد العملية */}
      {message && <p>{message}</p>}

      {/* المودال */}
      {showModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this task?</p>
            </div>
            <div className="delete-modal-actions">
              <button
                className="cancel-delete-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={() => {
                  deleteTask();
                  setShowModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
