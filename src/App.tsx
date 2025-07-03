import "./App.css";
import React, { useRef } from "react";
import Hero from "./components/Hero";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import CodeShowcase from "./components/CodeShowcase";
import WhackAGame from "./components/WhackAGame";
import ScrollToGame from "./components/ScrollToGame";

function App() {
  const gameRef = useRef<HTMLDivElement>(null);
  return (
    <div className="App">
      <ScrollToGame
        onClick={() => gameRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
      <Hero />
      <TechStack />
      <Projects />
      <CodeShowcase />
      <div ref={gameRef}>
        <WhackAGame />
      </div>
    </div>
  );
}

export default App;
