import { WEAPONS } from "./constants";

export const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));
export const selectComputerWeapon = () => WEAPONS[getRandomInt(3)];
