import { TMove } from "../Global";

/**
 * Ходы змеи. По задумке автора,
 * возможно предсказание ходов чужих змей.
 */
type TSnakeMoves = {
  id: string;
  moves: TMove[];
}

export default TSnakeMoves;