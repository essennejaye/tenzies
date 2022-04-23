import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './App.css';
import Die from './components/Die';

function App() {
  const [dice, setDice] = useState(() => allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollDiceCount, setRollDiceCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [newBestTime, setNewBestTime] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [disableRollBtn, setDisableRollBtn] = useState(true);
  const [disableGameBtn, setDisableGameBtn] = useState(false);

  const styles = {
    backgroundColor: intervalId ? 'tomato' : 'green',
  };
  const pauseGameStyle = {
    display: !intervalId && seconds ? 'block' : 'none',
  };
  const startGameStyle = {
    display: !intervalId && !seconds ? 'block' : 'none',
  };

  // tracks if game is over and saves best time
  // to local storage, alerts user if new best time has
  // been established
  useEffect(() => {
    const firstDie = dice[0].value;
    const gameOver = dice.every((die) => die.isHeld && die.value === firstDie);
    if (gameOver) {
      setTenzies(true);
      clearInterval(intervalId);
      setDisableGameBtn(true);
      const prevBestTime = parseInt(localStorage.getItem('time')) || 0;
      if (prevBestTime === 0 || seconds < prevBestTime) {
        setNewBestTime(true);
        localStorage.setItem('time', seconds);
      }
    }
  }, [dice, intervalId, seconds]);

  // formats time for display
  function formatTimer(secs) {
    const dHour = `${Math.trunc(secs / 3600)}`.padStart(2, '0');
    const dMin = `${Math.trunc((secs - dHour * 3600) / 60)}`.padStart(2, '0');
    const dSec = `${secs % 60}`.padStart(2, '0');
    return `${dHour}:${dMin}:${dSec}`;
  }

  function getNewDice() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  // initializes game dice
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(getNewDice());
    }
    return newDice;
  }

  // track number of rolls and get new dice
  // if game over reset state variables to initial game state
  function rollDice() {
    if (!tenzies) {
      setRollDiceCount((prevCount) => prevCount + 1);
      setDice((oldDice) =>
        oldDice.map((oldDie) =>
          oldDie.isHeld === true ? oldDie : getNewDice()
        )
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRollDiceCount(0);
      setSeconds(0);
      setNewBestTime(false);
      setIntervalId(0);
      setDisableRollBtn(true);
      setDisableGameBtn(false);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((oldDie) =>
        oldDie.id === id ? { ...oldDie, isHeld: !oldDie.isHeld } : oldDie
      )
    );
  }

  function handleClick() {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      setDisableRollBtn(true);
      return;
    }
    const newIntervalId = setInterval(() => {
      setSeconds((prevSec) => prevSec + 1);
    }, 1000);
    setIntervalId(newIntervalId);
    setDisableRollBtn(false);
  }

  const dieElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {newBestTime && <h1 className='best-time'>Best Time</h1>}
      {tenzies && <Confetti />}
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'>
        Click the <span className='start-text'>Start</span> button to load dice
        and start timer. <br />
        Click the <span className='roll-text'>Roll</span> button until all dice
        are the same. <br />
        Click each die to freeze it at its current value between rolls. <br />
        Click the <span className='pause-text'>Pause</span> button to
        temporarily stop the timer
        <br />
        &nbsp;&nbsp;and hide the dice.
        <br />
        Your best time will be saved.
      </p>

      <div className='container'>
        <h1 className='start-text' style={startGameStyle}>
          Start
        </h1>
        {intervalId ? (
          <div className='die-container'>{dieElements}</div>
        ) : (
          <h1 className='pause-text' style={pauseGameStyle}>
            Paused
          </h1>
        )}
      </div>
      <h2 className='roll-counter'>
        Number of Rolls: <span>{rollDiceCount}</span>
      </h2>

      <div className='btn-container'>
        <button
          className='btn roll-dice'
          disabled={disableRollBtn}
          onClick={rollDice}
        >
          {tenzies ? 'New Game' : 'Roll'}
        </button>
        <button
          className='btn game-play'
          style={styles}
          onClick={handleClick}
          disabled={disableGameBtn}
        >
          {intervalId ? 'Pause' : 'Start'}
        </button>
      </div>

      <p className='timerLabel top-right'>
        {` Elapsed Time:
           ${formatTimer(seconds)}`}
      </p>
    </main>
  );
}

export default App;
