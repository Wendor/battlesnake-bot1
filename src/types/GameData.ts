import { Snake } from "../global";

interface GameData {
  you: string,
  turn: number,
  snakes: Snake[],
  width: number,
  height: number,
  game_id: string,
  food: number[][],
  dead_snakes: Snake[],
  self: Snake
}

export default GameData;