import React, { useState } from "react";
import "../style/BlogPage.css";

import biorhythmImg from "../assets/biorhythm.png";
import dailyplannerImg from "../assets/dailyplanner.png";
import moodtrackerImg from "../assets/moodtracker.png"; 

const articles = [
  {
    id: 1,
    title: "Planning Your Day With Biorhythm",
    date: "September 23, 2025",
    preview: "Have you ever wondered why some days you feel full of energy, while other days...",
    image: biorhythmImg,
    content: `
      Life can feel overwhelming when tasks, ideas, and responsibilities float around with no clear order. 
      Our Daily Planner is directly linked to your Biorhythm, so your tasks adapt to your energy and focus cycles. 
      On high physical days, you’ll see active tasks. On low emotional days, the planner reminds you to care for yourself. 
      This way, you flow with your energy instead of fighting it.
    `,
  },
  {
    id: 2,
    title: "How To Track Your Mood",
    date: "September 23, 2025",
    preview: "Our moods shape how we see the world, how we treat others, and how much...",
    image: moodtrackerImg,
    content: `
      Tracking your mood helps you notice patterns in how you feel. 
      By logging your mood each day, you build awareness of what lifts you up and what drains you. 
      Over time, your mood tracker connects with your planner and biorhythm, creating a complete picture of your well-being. 
    `,
  },
  {
    id: 3,
    title: "The Power of a Daily Planner",
    date: "September 23, 2025",
    preview: "Life can feel overwhelming when tasks, ideas, and responsibilities float around...",
    image: dailyplannerImg,
    content: `
      A daily planner isn’t just about organization—it’s about clarity and peace of mind. 
      On this site, your planner is smarter because it listens to your biorhythm. 
      That means it suggests tasks based on your natural highs and lows, helping you balance productivity with self-care.
    `,
  },
];

const BlogPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="Blog-Page">
      <h1 className="Blog-Title">Wellness Blog</h1>
      <p className="Blog-subtitle">
        Tips, reflections, and insights for balance and productivity
      </p>

      {!selectedArticle ? (
        <div className="Blog-List">
          {articles.map((article) => (
            <div
              key={article.id}
              className="Blog-Card"
              onClick={() => setSelectedArticle(article)}
            >
              <img src={article.image} alt={article.title} />
              <h2>{article.title}</h2>
              <p className="date">{article.date}</p>
              <p className="preview">{article.preview}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="Blog-Article">
          <button className="back-btn" onClick={() => setSelectedArticle(null)}>
            ← Back to Blog
          </button>
          <h2>{selectedArticle.title}</h2>
          <p className="date">{selectedArticle.date}</p>
          <img src={selectedArticle.image} alt={selectedArticle.title} />
          <p className="content">{selectedArticle.content}</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;