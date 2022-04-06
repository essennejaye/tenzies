import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './App.css';
import Die from './components/Die';

function App() {
  const [dice, setDice] = useState(() => allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollDiceCount, setRollDiceCount] = useState(0);

  useEffect(() => {
    const firstDie = dice[0].value;
    const gameOver = dice.every((die) => die.isHeld && die.value === firstDie);
    if (gameOver) {
      setTenzies(true);
    }
  }, [dice]);

  function getNewDice() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(getNewDice());
    }
    return newDice;
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false);
      setDice(allNewDice());
      setRollDiceCount(0);
    } else {
      setRollDiceCount((prevCount) => prevCount + 1);
      setDice((oldDice) =>
        oldDice.map((oldDie) =>
          oldDie.isHeld === true ? oldDie : getNewDice()
        )
      );
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((oldDie) =>
        oldDie.id === id ? { ...oldDie, isHeld: !oldDie.isHeld } : oldDie
      )
    );
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
      {tenzies && <Confetti />}
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className='die-container'>{dieElements}</div>
      <h2 className='roll-counter'>
        Number of Rolls: <span>{rollDiceCount}</span>
      </h2>
      <button className='roll-dice' onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll Dice'}
      </button>
    </main>
  );
}

export default App;
