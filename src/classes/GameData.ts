import { TGameData, TCoord, TMove } from '../global.types';
import { Snake } from '../global.classes';


class GameData {
  public you: string          = "";
  public turn: number         = 0;
  public snakes: Snake[]      = [];
  public width: number        = 10;
  public height: number       = 10;
  public game_id: string      = "";
  public food: TCoord[]       = [];
  public dead_snakes: Snake[] = [];
  public raw: TGameData       = null;
  

  constructor(gameData: TGameData) {
    this.raw = gameData;
    this.you = gameData.you;
    this.turn = gameData.turn;
    this.snakes = gameData.snakes.map(snake => new Snake(snake));
    this.width = gameData.width;
    this.height = gameData.height;
    this.game_id = gameData.game_id;
    this.food = gameData.food.map(coord => <TCoord>{x: coord[0], y: coord[1]});
    this.dead_snakes = gameData.dead_snakes.map(snake => new Snake(snake));
  }

  self(): Snake {
    return this.snakes.find(snake => snake.id == this.you);
  }

  getSnakeByID(id: string): Snake {
    return this.snakes.find(snake => snake.id == id);
  }

  getMovesByID(id: string): TMove[] {
    const snake = this.getSnakeByID(id);
    const snakeHead = snake.coords[0];
    const moves: TMove[] = [
      { direction: "right", order: 1, x: snakeHead.x + 1, y: snakeHead.y },
      { direction: "down", order: 1, x: snakeHead.x, y: snakeHead.y + 1 },
      { direction: "left", order: 1, x: snakeHead.x - 1, y: snakeHead.y },
      { direction: "up", order: 1, x: snakeHead.x, y: snakeHead.y - 1 }
    ];
    return moves
            .filter(move => !this.collideWall(move))
            .filter(move => !this.collideSnakes(move));
  }

  collideFood(move: TMove): boolean {
    return this.food.findIndex(food => food.x == move.x && food.y == move.y) != -1;
  }

  collideWall(move: TMove): boolean {
    return  move.x >= this.width ||
            move.x < 0 ||
            move.y >= this.height ||
            move.y < 0;
  }

  collideSnakes(move: TMove): boolean {
    return this.snakes
            .map(snake => snake.coords)
            .reduce((bodies, coords) => [...bodies, ...coords], [])
            .findIndex(coord => coord.x == move.x && coord.y == move.y) != -1;
  }

  calcHeadsDistance(move: TMove): TMove {
    const headsDistance = this.snakes
            .filter(snake => snake.id != this.self().id)
            .map(snake => snake.coords[0])
            .map(coord => Math.abs(move.x - coord.x) + Math.abs(move.y - coord.y))
            .reduce((minHeadDist, dist) => Math.min(minHeadDist, dist), 100);
    move.head_distance = headsDistance;
    return move;
  }

  calcFoodDistance(move: TMove): TMove {
    if(this.food.length == 0) return move;

    const closestFood = this.food.sort((a,b) => {
      return  (Math.abs(move.x - a.x) + Math.abs(move.y - a.y)) -
              (Math.abs(move.x - b.x) + Math.abs(move.y - b.y));
    })[0];

    move.food_distance = Math.abs(move.x - closestFood.x) + Math.abs(move.y - closestFood.y);
    return move;
  }

  genGrid(): number[][] {
    const grid: number[][] = [];
    for (let x = 0; x < this.width; x++) {
      if (grid[x] === undefined) grid[x] = [];
      for (let y = 0; y < this.height; y++) {
	        grid[x][y] = 0;
      }
    }

    this.snakes
      .map(snake => snake.coords)
      .reduce((bodies, coords) => [...bodies, ...coords], [])
      .forEach(coord => grid[coord.y][coord.x] = 1)

    return grid;
  }
}

export default GameData;