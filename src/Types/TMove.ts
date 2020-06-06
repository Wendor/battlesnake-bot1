import { TCoord, TDirection } from '../Global';

/**
 * Ход. Расширенный вариант координаты. Содержит
 * координаты, направление, а также расстояние
 * до еды и голов чужих змей.
 */
type TMove = TCoord & {
  direction: TDirection;
  order: number;
  food_distance?: number;
  head_distance?: number;
}

export default TMove;