/**
 * Информация о змее, которую предоставил сервер.
 */
type TSnake = {
  id: string;
  name: string;
  health_points: number;
  taunt: string;
  coords: number[][];
}

export default TSnake;