import { TSnake } from "../Global";

/**
 * Информация о состоянии игры которую предоставил сервер.
 */
type TGameData = {
  you: string,
  turn: number,
  snakes: TSnake[],
  width: number,
  height: number,
  game_id: string,
  food: number[][],
  dead_snakes: TSnake[]
}

export default TGameData;