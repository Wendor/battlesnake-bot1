import { TSnake } from "../global.types";

type TGameData = {
  you: string,
  turn: number,
  snakes: TSnake[],
  width: number,
  height: number,
  game_id: string,
  food: number[][],
  dead_snakes: TSnake[],
  self: TSnake
}

export default TGameData;