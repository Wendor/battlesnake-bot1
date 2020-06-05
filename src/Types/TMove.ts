import { TDirection } from '../Global';

/**
 * Ход. Содержит направление, координаты, а также
 * расстояние до еды и голов чужих змей
 */
type TMove = {
  direction: TDirection;
  x: number;
  y: number;
  order: number;
  food_distance?: number;
  head_distance?: number;
}

export default TMove;