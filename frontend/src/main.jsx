import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./Style/index.css";

function createFloatingParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const container = document.createElement("div");
  container.className = "particles-container";
  document.body.appendChild(container);

  const colors = ["#93da97", "#5aa76f"];
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    const size = Math.random() * 5 + 2;
    const duration = 10 + Math.random() * 10;
    particle.className = "particle";
    particle.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      width:${size}px;
      height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      opacity:${Math.random() * 0.3 + 0.1};
      animation-duration:${duration}s;
      animation-delay:-${Math.random() * duration}s;
    `;
    container.appendChild(particle);
  }
}


const init = () => {
  createFloatingParticles();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
