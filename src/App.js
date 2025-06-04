import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
  // Используем Motion для анимаций

// Настройки игры
const gameWidth = 800;
const gameHeight = 600;
const carWidth = 50;
const carHeight = 80;

const carSpeed = 5;  // Скорость игрока
const enemySpeed = 4;  // Скорость врагов
const enemyFrequency = 2000; // Частота появления врагов (мс)

function RacingGame() {
  const [playerPos, setPlayerPos] = useState(gameHeight - carHeight - 10);  // Позиция игрока по вертикали
  const [enemies, setEnemies] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  // Добавление врагов
  useEffect(() => {
    const enemyInterval = setInterval(() => {
      setEnemies((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: Math.floor(Math.random() * (gameWidth - carWidth)),
          y: -carHeight,  // Начальная позиция врага
        },
      ]);
    }, enemyFrequency);

    return () => clearInterval(enemyInterval);
  }, []);

  // Движение врагов
  useEffect(() => {
    const gameInterval = setInterval(() => {
      setEnemies((prev) => {
        const updatedEnemies = prev.map((enemy) => ({
          ...enemy,
          y: enemy.y + enemySpeed,
        }));

        // Проверка на столкновение
        for (const enemy of updatedEnemies) {
          if (
            enemy.y + carHeight > playerPos &&
            enemy.y < playerPos + carHeight &&
            enemy.x + carWidth > gameWidth / 2 - carWidth / 2 &&
            enemy.x < gameWidth / 2 + carWidth / 2
          ) {
            setGameOver(true);
            clearInterval(gameInterval);
          }
        }

        return updatedEnemies.filter((enemy) => enemy.y < gameHeight); // Убираем врагов, которые покинули экран
      });

      setScore((prevScore) => prevScore + 1); // Увеличиваем счет
    }, 50); // Обновляем каждую 50-ю миллисекунду

    return () => clearInterval(gameInterval);
  }, [playerPos]);

  // Управление жестами
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart(touch.pageY);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null) return;

    const touch = e.touches[0];
    const touchDelta = touchStart - touch.pageY;

    setPlayerPos((prevPos) => {
      let newPos = prevPos + touchDelta * 0.2; // Управление чувствительностью

      // Ограничиваем движение по экрану
      if (newPos < 0) newPos = 0;
      if (newPos > gameHeight - carHeight) newPos = gameHeight - carHeight;

      setTouchStart(touch.pageY);
      return newPos;
    });
  };

  // Отображение игры
  return (
    <div
      style={{
        position: 'relative',
        width: gameWidth,
        height: gameHeight,
        backgroundColor: 'lightgray',
        overflow: 'hidden',
        margin: '0 auto',
        touchAction: 'none',  // Отключаем стандартные действия для тачскрина
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <h2>Score: {score}</h2>
      {gameOver && <h2>Game Over!</h2>}
      {!gameOver && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: playerPos,
            left: gameWidth / 2 - carWidth / 2,
            width: carWidth,
            height: carHeight,
            backgroundColor: 'blue',
            borderRadius: '8px',
          }}
          animate={{ y: playerPos }}
        />
      )}

      {enemies.map((enemy) => (
        <motion.div
          key={enemy.id}
          style={{
            position: 'absolute',
            top: enemy.y,
            left: enemy.x,
            width: carWidth,
            height: carHeight,
            backgroundColor: 'red',
            borderRadius: '8px',
          }}
          animate={{ y: enemy.y }}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <RacingGame />
    </div>
  );
}

export default App;
