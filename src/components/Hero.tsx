import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, contactType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedContact(contactType);
      setTimeout(() => setCopiedContact(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section
      id="about"
      ref={ref}
      className={`hero-section section-animate${visible ? " visible" : ""}`}
    >
      <div className="hero-info">
        <h1>Епихин Всеволод</h1>
        <p>
          Frontend-разработчик с 4 годами коммерческого опыта. Специализируюсь
          на разработке интерфейсов на React и TypeScript. Уверенно работаю с
          состоянием через Redux Toolkit/RTK Query, mobx,zustand. Разбираюсь в
          архитектуре, декомпозиции, проектировании UI. Участвовал в проектах с
          высокой нагрузкой, внедрял отложенную подгрузку данных, Skeleton UI и
          оптимизацию ререндеров. Умею переводить бизнес-требования в стабильные
          и поддерживаемые интерфейсы. Пишу читаемый и типобезопасный код,
          участвую в code review, слежу за качеством UI/UX.
        </p>
        <p>
          За пределами рабочего стола люблю волейбол, который помогает не только
          перезагрузиться, но и всегда помнить, что результат - это ещё и
          командное взаимодействие
        </p>

        <div className="hero-contacts">
          <div className="contact-item">
            <span className="contact-label">Telegram:</span>
            <a
              className="contact-value"
              href="https://t.me/zzzsevazzz"
              target="_blank"
              rel="noopener noreferrer"
              title="Открыть Telegram"
              style={{ textDecoration: "none" }}
            >
              @zzzsevazzz
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-label">Email:</span>
            <a
              className="contact-value"
              href="mailto:epikhin01_03@mail.ru"
              title="Написать на почту"
              style={{ textDecoration: "none" }}
            >
              epikhin01_03@mail.ru
            </a>
          </div>

          <div className="contact-item">
            <span className="contact-label">Phone:</span>
            <span
              className="contact-value"
              onClick={() => copyToClipboard("+7 (989) 613-58-50", "phone")}
              title="Нажмите чтобы скопировать"
            >
              +7 (989) 613-58-50
              {copiedContact === "phone" && (
                <span className="copy-indicator">✓ Скопировано!</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="hero-photo">
        <img src="/visite-site/photo.jpg" alt="Фото" />
      </div>
    </section>
  );
};

export default Hero;
