import React, { useState } from "react";
import { play } from "../game/game";
import { WEAPONS } from "../constants";

const initialState = {
  computerWeapon: null,
  userWeapon: null,
  winner: false
};

const Game = () => {
  // set init state
  const [state, setState] = useState(initialState);

  // onclick set weapon
  const playAction = playerWeapon => {
    // computer pick weapon
    const result = play(playerWeapon);

    setState(result);
  };

  // null winner state
  const reset = () => {
    setState(initialState);
  };

  return (
    <div>
      <h1>Rock, Paper, Scissors</h1>
      <h2>Pick a weapon:</h2>
      <div>
        {WEAPONS.map(w => (
          <button onClick={() => playAction(w)} key={w}>
            {w}
          </button>
        ))}
      </div>

      {state.winner && (
        <div>
          {state.winner !== "Draw" && <h3>Winner: {state.winner}!</h3>}
          {state.winner === "Draw" && <h3>It's a draw!</h3>}
          <button onClick={reset}>Again!</button>
        </div>
      )}
    </div>
  );
};

export default Game;
