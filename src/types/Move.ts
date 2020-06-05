import { TDirection } from '../global.types';

type TMove = {
  direction: TDirection;
  x: number;
  y: number;
  order: number;
  food_distance?: number;
  head_distance?: number;
}

export default TMove;