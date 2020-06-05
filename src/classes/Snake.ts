import { TSnake, TCoord, TMove } from '../global.types';

class Snake {
  id: string;
  name: string;
  health_points: number;
  taunt: string;
  coords: TCoord[]

  constructor(snake: TSnake) {
    this.id = snake.id;
    this.name = snake.name;
    this.health_points = snake.health_points;
    this.taunt = snake.taunt;
    this.coords = snake.coords.map(coord => <TCoord>{x: coord[0], y: coord[1]});
  }

  move(move: TMove, toFood: boolean) {
    if(toFood) {
      this.health_points = 100;
    } else {
      this.health_points--;
      this.coords.pop();
    }
    this.coords.unshift(<TCoord>{x: move.x, y: move.y});
  }
}

export default Snake;