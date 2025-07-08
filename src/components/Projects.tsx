import React, { useEffect, useRef, useState } from "react";

type Project = {
  title: string;
  team: string;
  duration: string;
  description: string;
  role: string;
  duties: string | string[];
  achievements: string | string[];
  stack: string;
};

const projects: Project[] = [
  {
    title: "РНКБ — Дистанционное банковское обслуживание",
    team: "2 Frontend, 3 Backend, 1 тестировщик, 2 аналитика, Team-Lead",
    role: "Frontend-разработчик",
    duration: "06.2024 – 07.2025",
    description: "В рамках проекта реализована и продолжает развиваться система интернет-банкинга (дистанционного банковского обслуживания) для физических лиц. Разработка представляет собой единую UI платформу, включающую публичную и идентифицированную зоны.",
    duties: [
      "Автоматизация CI/CD приложения",
      "Адаптив макетов для корректного отображения как на десктопах, так и на мобильных устройствах при помощи media-query.",
      "Работа по Agile и Scrum, переход от монолитной архитектуры к микросервисной, конфигурация настраивалась при помощи Webpack",
      "Реализация микрофронтов отвечающих за дистанционное банковское обслуживание при помощи React, Redux и MUI",
      "Взаимодействие с API для получения, редактирования данных при помощи GraphQL и Apollo",
      "Покрытие функционала unit тестами при помощи react-testing-library",
    ],
    achievements: [
      "Разделил монолит на микрофронты (Module Federation).",
      "Реализовал основные микрофронты отвечающие за подбор кредитных и ипотечных услуг",
      "Оптимизировал рендер, виртуализацию (react-window), тестирование (70%). ",
      "Настроил CI/CD.",
      "Добавил универсальное решение для обработки ошибок и отображения уведомлений с помощью Error Boundary и Snackbar, что упростило отладку и улучшило UX"
    ],
    stack:
      "React, TypeScript, Redux, GraphQL, Apollo, MUI, Webpack, Less, react-testing-library",
  },
  {
    title: "Finiche — Финансовый проект для поиска акций",
    team: "3 Frontend-разработчика, 2 Backend-разработчика, 2 тестировщика, 2 системных аналитика, Team-Lead",
    role: "Frontend-разработчик",
    duration: "01.2023 – 06.2024",
    description: "	Финансовый проект, создание отдельных виджетов для внедрений их в WordPress. Виджеты по типу yahoo.finance, содержат в себе поиск акций, всю необходимую информацию о них в виде графиков и таблиц, скрининг акций в виде таблицы с возможностью фильтрации, сортировки и поиска.",
    duties: [
      "Работа по Agile и Scrum, написание тестов при помощи Jest",
      "Создание составляющих компонентов и логики виджетов при помощи React компонентов",
      "Стилизация компонентов при помощи Ant",
      "Построение графиков от стандартных линейных до графиков типа Свеча при помощи Chart.js",
      "Создание таблиц с пагинацией при помощи нативных HTML5 тэгов",
      "Локализация виджетов с помощью react-intl (локализация для 9-ти языков)",
    ],
    achievements: [
      "Создание компонентов поверх Ant Design для модификации компонентов. ",
      "Реализация хука useChart для определения типа свечи",
      "реализация хука для пагинации usePaginatedFetch и usePaginatedSelector",
      "Построение графиков разной формы и сложности",
      "Локализация всех виджетов",
    ],
    stack: "JavaScript, React 18, Mobx, react-intl, Ant Design, Chart.js, Postcss.",
  },
  {
    title: "Под NDA(биржа криптовалют) — Сервис для алгоритмической торговли на рынках криптовалютных бирж",
    team: "2 Frontend-разработчика, 2 Backend-разработчика, 1 full-stack разработчик, 2 тестировщика, 1 системный аналитик, Team-Lead",
    role: "Frontend-разработчик",
    duration: "07.2021 – 01.2023",
    description: "Сервис (платформа) для алгоритмической торговли на спотовых и фьючерсных рынках криптовалютных бирж.Данный сервис позволяет: выбрать предустановленные, скопировать эффективные у пользователей, или настроить свои уникальные торговые стратегии.",
    duties: [
      "Внедрение системы уведомлений на основе технологии socket.io",
      "Работа над реализацией сложных SVG анимаций, визуализацией торговых ботов при помощи Animate.css и Sass",
      "Оптимизация производительности: lazy loading, мемоизация, критический CSS",
      "Настройка Docker-compose и создание Dockerfile для запуска приложения",
      "Настройка доступности, SEO-оптимизации и работы с поисковыми роботами",
    ],
    achievements: [
      "Реализация сложных svg-анимаций с крутящимися логотипами, движениями робота-бота, искревленными углами различных модальных окон и форм",
      "Реализация хука useDataRequest для определения типа запроса(https/websocket)",
      "Настройка Docker-compose",
      "настройка SEO-Оптимизации, доступности и работы скринридеров при помощи атрибутов, семантики и Lightehouse",
      "Интегрировал глобальный state-менеджмент на основе Zustand, обеспечив стабильную работу с real-time данными и упростив логику взаимодействия между компонентами."
    ],
    stack: "JavaScript, React 18, Sass, Ant Design, Zustand, Socket.io, Animate.css, Docker",
  },
];

const renderListOrText = (data: string | string[]) => {
  if (Array.isArray(data)) {
    return (
      <ul style={{ margin: "8px 0 8px 18px", padding: 0 }}>
        {data.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <span>{data}</span>;
};

const Projects: React.FC = () => {
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
      id="projects"
      ref={ref}
      className={`section-animate${visible ? " visible" : ""}`}
    >
      <h2>Проекты</h2>
      <div className="projects">
        {projects.map((p, i) => (
          <div
            className="project-card"
            key={i}
            style={{ transitionDelay: visible ? `${0.2 + i * 0.15}s` : "0s" }}
          >
            <h3>{p.title}</h3>
            <p>
              {renderListOrText(p.description)}
            </p>
            <p>
              <strong>Роль:</strong> {renderListOrText(p.role)}
            </p>
            <p>
              <strong>Длительность:</strong> {renderListOrText(p.duration)}
            </p>
            <p>
              <strong>Обязанности:</strong> {renderListOrText(p.duties)}
            </p>
            <p>
              <strong>Достижения:</strong> {renderListOrText(p.achievements)}
            </p>
            <p>
              <strong>Стек:</strong> {p.stack}
            </p>
            <p>
              <strong>Команда:</strong> {p.team}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
