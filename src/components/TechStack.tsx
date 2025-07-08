import React, { useEffect, useRef, useState } from "react";
import "./TechStack.css";

const technologies = [
  "React",
  "TypeScript",
  "JavaScript",
  "Redux",
  "GraphQL",
  "Apollo",
  "MUI",
  "Ant Design",
  "Sass",
  "Less",
  "Zustand",
  "Docker",
  "Jest",
  "Chart.js",
  "Mobx",
  "Postcss",
  "Socket.io",
  "Animate.css",
  "react-testing-library",
];

const half = Math.ceil(technologies.length / 2);
const topRow = technologies.slice(0, half);
const bottomRow = technologies.slice(half);

const TechStack: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      id="tech"
      ref={ref}
      className={`techstack-section section-animate${
        visible ? " visible" : ""
      }`}
    >
      <h2>Технологии</h2>
      <div className="techstack-marquee-wrapper">
        <div className="techstack-marquee techstack-marquee-right">
          {[...topRow, ...topRow].map((tech, i) => (
            <span className="techstack-item" key={"top-" + i + tech}>
              {tech}
            </span>
          ))}
        </div>
        <div className="techstack-marquee techstack-marquee-left">
          {[...bottomRow, ...bottomRow].map((tech, i) => (
            <span className="techstack-item" key={"bot-" + i + tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
