// SingleStreak.jsx (no major changes, but included for completeness)
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Style/StreaksPage.css";

export const SingleStreak = ({ date }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const res = await axios.get(
        `http://localhost:5000/api/streak/completed-days/date/${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err.response?.data || err.message);
      setError(`Failed to load streak logs: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) fetchLogs();
  }, [date]);

  if (loading) return <p>Loading streak logs...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="single-streak">
      <h2>Streak Logs for {date}</h2>
      {logs.length > 0 ? (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.title}</strong> - {log.description || "No description"} ✅
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed tasks on this day.</p>
      )}
    </div>
  );
};