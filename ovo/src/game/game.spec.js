import { play } from "./game";

jest.mock("../helper", () => ({
  selectComputerWeapon: () => "Rock"
}));

describe("Game logic", () => {
  test("test for draw", () => {
    expect(play("Rock")).toEqual({
      winner: "Draw"
    });
  });

  test("test for win", () => {
    expect(play("Paper")).toEqual({
      winner: "User wins"
    });
  });

  test("test for lose", () => {
    expect(play("Scissors")).toEqual({
      winner: "Computer wins"
    });
  });
});
