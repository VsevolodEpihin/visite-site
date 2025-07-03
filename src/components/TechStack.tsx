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
      ref={ref}
      className={`techstack-section section-animate${
        visible ? " visible" : ""
      }`}
    >
      <h2>Технологии</h2>
      <div className="techstack-list">
        {technologies.map((tech) => (
          <span className="techstack-item" key={tech}>
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
