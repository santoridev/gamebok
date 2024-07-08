import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [lastCollected, setLastCollected] = useState(
      localStorage.getItem('lastCollected')
          ? new Date(localStorage.getItem('lastCollected'))
          : null
  );
  const [timeLeft, setTimeLeft] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      if (lastCollected) {
        const now = new Date();
        const nextCollectTime = new Date(lastCollected.getTime() + 4 * 60 * 60 * 1000);
        const timeDifference = nextCollectTime - now;

        if (timeDifference <= 0) {
          setTimeLeft(0);
        } else {
          setTimeLeft(timeDifference);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastCollected]);

  useEffect(() => {
    if (window.Telegram.WebApp.initDataUnsafe?.user) {
      setUsername(window.Telegram.WebApp.initDataUnsafe.user.username || 'Guest');
    }
  }, []);

  const collectReward = () => {
    const now = new Date();
    setLastCollected(now);
    localStorage.setItem('lastCollected', now);
    setTimeLeft(4 * 60 * 60 * 1000);
  };

  const formatTimeLeft = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Соберите свою награду!</h1>
          <p>Привет, {username}!</p>
          {timeLeft !== null ? (
              timeLeft > 0 ? (
                  <div>
                    <p>Время до следующей награды: {formatTimeLeft(timeLeft)}</p>
                  </div>
              ) : (
                  <button onClick={collectReward}>Собрать награду</button>
              )
          ) : (
              <button onClick={collectReward}>Собрать награду</button>
          )}
        </header>
      </div>
  );
}

export default App;
