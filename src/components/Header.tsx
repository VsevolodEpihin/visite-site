import React, { useState } from "react";
import "./Header.css";

const navItems = [
  { label: "О себе", anchor: "about" },
  { label: "Технологии", anchor: "tech" },
  { label: "Проекты", anchor: "projects" },
  { label: "Gists", anchor: "gists" },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
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
      <button
        className={`header-burger${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Открыть меню"
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`header-mobile-menu${menuOpen ? " open" : ""}`}>
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
      </div>
      {menuOpen && (
        <div
          className="header-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
