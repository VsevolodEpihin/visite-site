import React from "react";
import "./Header.css";

const navItems = [
  { label: "О себе", anchor: "about" },
  { label: "Технологии", anchor: "tech" },
  { label: "Проекты", anchor: "projects" },
  { label: "Гисты", anchor: "gists" },
  { label: "Игра", anchor: "game" },
];

const Header: React.FC = () => {
  const handleNavClick = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header-fixed">
      <nav className="header-nav">
        {navItems.map((item) => (
          <button
            key={item.anchor}
            className="header-link"
            onClick={() => handleNavClick(item.anchor)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
