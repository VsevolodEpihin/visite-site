import React from "react";
import "./ScrollToGame.css";

type Props = {
  onClick: () => void;
};

const ScrollToGame: React.FC<Props> = ({ onClick }) => (
  <div className="scroll-to-game-container" onClick={onClick}>
    <div className="scroll-to-game-circle">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="14" cy="14" r="14" fill="#65b7f6" />
        <path
          d="M14 8V20"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8 14L14 20L20 14"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <span className="scroll-to-game-text">Устали от моего резюме?</span>
  </div>
);

export default ScrollToGame;
