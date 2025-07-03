import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      ref={ref}
      className={`hero-section section-animate${visible ? " visible" : ""}`}
    >
      <div className="hero-info">
        <h1>Епихин Всеволод</h1>
        <p>
        Я являюсь Frontend-разработчиком с 4 годами коммерческого опыта. Специализируюсь на технологиях React, Js, Typescript. Стремлюсь к созданию интуитивно понятных интерфейсов и улучшению пользовательского опыта.Умею переводить бизнес-требования в стабильные и масштабируемые пользовательские интерфейсы.
        </p>
        <p>
        За пределами рабочего стола люблю волейбол, который помогает не только перезагрузиться, но и всегда помнить, что результат - это ещё и командное взаимодействие
        </p>
      </div>
      <div className="hero-photo">
        <img src="/photo.jpg" alt="Фото" />
      </div>
    </section>
  );
};

export default Hero;
