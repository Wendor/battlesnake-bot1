import { TGameData, TCoord, TMove, Snake } from "../Global";


/**
 * Сожержит данные о состоянии игры
 *
 * @class GameData
 */
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
  

  /**
   * Создает экземпляр данных о состоянии игры
   * на основе данных от сервера
   * 
   * @param {TGameData} gameData
   * @memberof GameData
   */
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


  /**
   * Возвращает хмею игрока
   *
   * @returns {Snake}
   * @memberof GameData
   */
  self(): Snake {
    return this.snakes.find(snake => snake.id == this.you);
  }


  /**
   * Возвращает змею по ее ID
   *
   * @param {string} id
   * @returns {Snake}
   * @memberof GameData
   */
  getSnakeByID(id: string): Snake {
    return this.snakes.find(snake => snake.id == id);
  }


  /**
   * Возвращает возможные ходы для змеи по ID
   *
   * @param {string} id
   * @returns {TMove[]}
   * @memberof GameData
   */
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


  /**
   * Возвращает `true` если ход принесет еду
   *
   * @param {TMove} move
   * @returns {boolean}
   * @memberof GameData
   */
  collideFood(move: TMove): boolean {
    return this.food.findIndex(food => food.x == move.x && food.y == move.y) != -1;
  }


  /**
   * Возвращает `true` если ход приводит в стену
   *
   * @param {TMove} move
   * @returns {boolean}
   * @memberof GameData
   */
  collideWall(move: TMove): boolean {
    return  move.x >= this.width ||
            move.x < 0 ||
            move.y >= this.height ||
            move.y < 0;
  }


  /**
   * Возвращает `true` если ход приведит к столкновению
   * со змеей
   *
   * @param {TMove} move
   * @returns {boolean}
   * @memberof GameData
   */
  collideSnakes(move: TMove): boolean {
    return this.snakes
            .map(snake => {
              // разрешим ходить в свой хвост
              if(snake.id == this.self().id) {
                return snake.coords.slice(0, -1);
              }
              return snake.coords;
            })
            .reduce((bodies, coords) => [...bodies, ...coords], [])
            .findIndex(coord => coord.x == move.x && coord.y == move.y) != -1;
  }


  /**
   * Расчитывает минимальное расстояние до голов длинных
   * вражеских змей и проставляет `head_distance` для хода.
   *
   * @param {TMove} move
   * @returns {TMove}
   * @memberof GameData
   */
  calcHeadsDistance(move: TMove): TMove {
    const headsDistance = this.snakes
            .filter(snake => snake.id != this.self().id)
            .map(snake => snake.coords[0])
            .map(coord => Math.abs(move.x - coord.x) + Math.abs(move.y - coord.y))
            .reduce((minHeadDist, dist) => Math.min(minHeadDist, dist), 100);
    move.head_distance = headsDistance;
    return move;
  }


  /**
   * Расчитывает расстояние до ближайшей еды
   * и проставляет `food_distance` для хода.
   *
   * @param {TMove} move
   * @returns {TMove}
   * @memberof GameData
   */
  calcFoodDistance(move: TMove): TMove {
    if(this.food.length == 0) return move;

    const closestFood = this.food.sort((a,b) => {
      return  (Math.abs(move.x - a.x) + Math.abs(move.y - a.y)) -
              (Math.abs(move.x - b.x) + Math.abs(move.y - b.y));
    })[0];

    move.food_distance = Math.abs(move.x - closestFood.x) + Math.abs(move.y - closestFood.y);
    return move;
  }


  /**
   * Генерирует матрицу с координатами змей (для дебага)
   *
   * @returns {number[][]}
   * @memberof GameData
   */
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