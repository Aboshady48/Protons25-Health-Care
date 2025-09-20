import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Style/GetAllTasks.css";

const GetAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 2; 

  useEffect(() => {
    const getAllData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          console.error("No token found, please log in first.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/tasks/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error.response?.data || error.message);
      }
    };

    getAllData();
  }, []);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="GetAllTasks-container">
      <h2>All Tasks</h2>
      <ul>
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default GetAllTasks;