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
    <div>
      <section
        ref={ref}
        className={`hero-section section-animate${visible ? " visible" : ""}`}
      >
        <div className="hero-info">
          <h1>Епихин Всеволод</h1>
          <p>
          Frontend-разработчик с 4 годами коммерческого опыта. Специализируюсь на разработке интерфейсов на React и TypeScript. Уверенно работаю с состоянием через Redux Toolkit/RTK Query, mobx,zustand. Разбираюсь в архитектуре, декомпозиции, проектировании UI. Участвовал в проектах с высокой нагрузкой, внедрял отложенную подгрузку данных, Skeleton UI и оптимизацию ререндеров. Умею переводить бизнес-требования в стабильные и поддерживаемые интерфейсы. Пишу читаемый и типобезопасный код, участвую в code review, слежу за качеством UI/UX.
          </p>
          <p>
            За пределами рабочего стола люблю волейбол, который помогает не
            только перезагрузиться, но и всегда помнить, что результат - это ещё
            и командное взаимодействие
          </p>
          <div className="hero-contacts">
            <h3>Контакты</h3>
            <div className="hero-contacts-list">
              <div className="hero-contact">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="11" fill="#65b7f6" />
                  <path
                    d="M6 11.5L16 7.5L13.5 16L10 13.5L8.5 15.5L8 12L15 8.5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>@zzzsevazzz</span>
              </div>
              <div className="hero-contact">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="11" fill="#65b7f6" />
                  <path
                    d="M6 8L11 12L16 8"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="6"
                    y="8"
                    width="10"
                    height="6"
                    rx="2"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </svg>
                <span>epikhiin21@mail.ru</span>
              </div>
              <div className="hero-contact">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="11" fill="#65b7f6" />
                  <path
                    d="M8 7C8.5 10 11 12.5 14 13C14.5 12.5 15 12 15 11.5V10.5C15 10 14.5 9.5 14 9.5H13.5C13 9.5 12.5 10 12.5 10.5V11C12.5 11.5 13 12 13.5 12"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>+7 989 613-58-50</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/visite-site/photo.jpg" alt="Фото" />
        </div>
      </section>
    </div>
  );
};

export default Hero;
