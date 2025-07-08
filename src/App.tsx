import "./App.css";
import { useRef } from "react";
import Hero from "./components/Hero";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import WhackAGame from "./components/WhackAGame";
import ScrollToGame from "./components/ScrollToGame";
import ScrollToUp from "./components/ScrollToUp";
import Header from "./components/Header";
import CodeAccordion from "./components/CodeAccordion";

function App() {
  const gameRef = useRef<HTMLDivElement>(null);
  return (
    <>
    <Header />
    <div className="App">
      <Hero />
      <TechStack />
      <ScrollToGame
        onClick={() => gameRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
      <Projects />
      <CodeAccordion /> 
      <div ref={gameRef}>
        <WhackAGame />
      </div>
      <ScrollToUp />
    </div>
    </>
  );
}

export default App;
