import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
import "../../Style/EditTask.css";

const EditTask = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, please log in first.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
      } catch (error) {
        console.error("Error fetching task:", error.response?.data || error.message);
      }
    };

    fetchTask();
  }, [id]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in first!");
        return;
      }

      const body = { title, description };

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
      navigate("/tasks"); 
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
    }
  };

  return (
    <div className="AddTask-container">
      <h2>Edit Task</h2>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          placeholder="Enter title"
          className="todo-input todo-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Edit Your Task"
          className="todo-input todo-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit" className="todo-button">
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;

