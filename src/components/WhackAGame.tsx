import React, { useEffect, useRef, useState } from "react";
import "./WhackAGame.css";

const ANIMALS = [
  { name: "Кот", emoji: "🐱" },
  { name: "Крот", emoji: "🦦" },
  { name: "Собака", emoji: "🐶" },
];

const HOLES = 9;
const WIN_SCORE = 5;
const GAME_TIME = 10;

const WhackAGame: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);
  const [animal, setAnimal] = useState(ANIMALS[0]);
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState<null | boolean>(null);
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(GAME_TIME);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!started || success !== null) return;
    intervalRef.current = setInterval(() => {
      setActive(Math.floor(Math.random() * HOLES));
      setAnimal(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
    }, 800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, success]);

  useEffect(() => {
    if (!started || success !== null) return;
    gameTimerRef.current = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [started, success]);

  useEffect(() => {
    if (timer === 0 && started && success === null) {
      setStarted(false);
      setActive(null);
      setSuccess(score >= WIN_SCORE);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    }
  }, [timer, started, success, score]);

  useEffect(() => {
    if (score >= WIN_SCORE && started && success === null) {
      setSuccess(true);
      setStarted(false);
      setActive(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    }
  }, [score, started, success]);

  const handleHit = (idx: number) => {
    if (idx === active && started && success === null) {
      setScore((s) => s + 1);
      setActive(null);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setSuccess(null);
    setActive(null);
    setStarted(false);
    setTimer(GAME_TIME);
  };

  const handleStart = () => {
    setScore(0);
    setSuccess(null);
    setActive(null);
    setStarted(true);
    setTimer(GAME_TIME);
  };

  return (
    <>
    <div id="game" className="whacka-container">
      <h2>Успей погладить питомца!</h2>
      <div className="whacka-score">Счет: {score}</div>
      <div className="whacka-timer">Время: {timer} сек</div>
      <div className="whacka-grid">
        {Array.from({ length: HOLES }).map((_, idx) => (
          <div
            key={idx}
            className={`whacka-hole${active === idx ? " active" : ""}`}
            onClick={() => handleHit(idx)}
          >
            {active === idx && started && success === null && (
              <span
                className="whacka-animal"
                role="img"
                aria-label={animal.name}
              >
                {animal.emoji}
              </span>
            )}
          </div>
        ))}
      </div>
      {!started && success === null && (
        <button className="whacka-start" onClick={handleStart}>
          Start
        </button>
      )}
      {success === true && (
        <>
          <div className="whacka-success">Successfull!</div>
          <button className="whacka-restart" onClick={handleRestart}>
            Restart
          </button>
        </>
      )}
      {success === false && (
        <>
          <div className="whacka-unsuccess">Unsuccessfull!</div>
          <button className="whacka-restart" onClick={handleRestart}>
            Restart
          </button>
        </>
      )}
    </div>
    </>
    
  );
};

export default WhackAGame;
