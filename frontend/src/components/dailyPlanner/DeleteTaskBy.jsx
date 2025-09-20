import axios from 'axios';
import {useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
export const DeleteTasks = ()=>{
    //http://localhost:5000/api/tasks/${id}
    const {id} = useParams();
    const [message,setMessage] = useState("");
    const deleteTask = async()=>{
        try{
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, please log in first.");
                return;
            }
            const response = await axios.delete(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setMessage("Task deleted successfully");
        }
        catch(error){
            console.error("Error deleting task:", error.response?.data || error.message);
            setMessage("Error deleting task");
        }
    }

    return(
        <div>
        <h2>Delete Task</h2>
        <button onClick={deleteTask}>Delete Task</button>
        {message && <p>{message}</p>}
            
        </div>
    )
}