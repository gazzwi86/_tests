import { WIN_MATRIX } from "../constants";
import { selectComputerWeapon } from "../helper";

export const play = playerWeapon => {
  const computerWeapon = selectComputerWeapon();

  // if users weapon loses to computers
  if (playerWeapon === computerWeapon) {
    return {
      winner: "Draw"
    };
  } else if (WIN_MATRIX[playerWeapon.toLowerCase()] === computerWeapon) {
    return {
      winner: "Computer wins"
    };
  }

  return {
    winner: "User wins"
  };
};
