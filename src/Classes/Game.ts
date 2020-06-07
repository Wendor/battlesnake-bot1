import { TMove, TSnakeMoves, TVangaOptions, GameData } from "../Global";
import { performance } from 'perf_hooks';

let maxPath: TMove[] = [];

/**
 * Класс игры. Строит поле игры по переданным ему значениям
 * и находит возможные движения игрока
 *
 * @class Game
 */
class Game {
  gameData: GameData;
  snakeMoves: TSnakeMoves[];
  vangaOptions: TVangaOptions = {
    depth: 30,
    step: 1,
    startTime: null
  };
  first: boolean = false;


  /**
   * Создает экземпляр игры. Может применить к полю переданные
   * движения змей.
   * 
   * @param {GameData} gameData
   * @param {TSnakeMoves[]} [snakeMoves=[]]
   * @param {{}} [options={}]
   * @memberof Game
   */
  constructor(  gameData: GameData,
                snakeMoves: TSnakeMoves[] = [],
                vangaOptions: TVangaOptions = {}) {

    this.gameData = gameData;

    this.snakeMoves = snakeMoves;
    if(snakeMoves.length > 0) {
      for(let sm of snakeMoves) {
        const snake = this.gameData.getSnakeByID(sm.id);
        for(let move of sm.moves) {
          snake.move(move, this.gameData.collideFood(move));
        }
      }
    }

    for(let key in vangaOptions) {
      this.vangaOptions[key] = vangaOptions[key];
    }

  }


  /**
   * Возвращает массив возможных движений игрока.
   * 
   * @param {boolean} [findFood=false]
   * @returns {TMove[]}
   * @memberof Game
   */
  findSelfMoves(findFood = false): TMove[] {
    if(this.gameData.self().health_points == 0) return [];
    let moves = this.gameData.getMovesByID(this.gameData.you);

    // Поиск еды
    if(findFood) {
      moves = moves.map(move => this.gameData.calcFoodDistance(move));
      const minFoodDistance = Math.min(...moves.map(move => move.food_distance));
      if(this.gameData.self().health_points < Math.max(60, this.gameData.width) ||
          minFoodDistance <= 5) {
        moves.forEach((move, i) => {
          if(move.food_distance == minFoodDistance) {
            moves[i].order += 0.1;
          }
        });
      }
    }

    // Поиск голов вражеских змей
    moves = moves.map(move => this.gameData.calcHeadsDistance(move));
    moves.forEach((move, i) => {
      if(move.head_distance <= 2) {
        moves[i].order -= 0.2;
      }
    });

    // Перемешаем и отсортируем по приоритету
    moves = this.randomizeMoves(moves).sort((a, b) => b.order - a.order);
    
    return moves;
  }


  /**
   * Перемешивает массив движений.
   *
   * @param {TMove[]} moves
   * @returns {TMove[]}
   * @memberof Game
   */
  randomizeMoves(moves: TMove[]): TMove[] {
    var ctr = moves.length, temp, index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = moves[ctr];
      moves[ctr] = moves[index];
      moves[index] = temp;
    }
    return moves;
  }


  /**
   * Черная магия. Вангуем цепочку ходов в рекурсии.
   *
   * @returns {TMove[]}
   * @memberof Game
   */
  vanga(): TMove[] {
    let selfMoves = this.snakeMoves.find(sm => sm.id == this.gameData.you);

    if(!selfMoves) {
      this.first = true;
      this.vangaOptions.depth = Math.max(
        (this.gameData.width + this.gameData.height)*2,
        this.gameData.self().coords.length*2,
        this.gameData.self().health_points
      );
      maxPath = [];
      selfMoves = { id: this.gameData.you, moves: []};
    }

    if(selfMoves.moves.length >= this.vangaOptions.depth) {
      return selfMoves.moves;
    }

    if(performance.now() - this.vangaOptions.startTime >= 190) {
      if(this.first) {
        return maxPath;
      }
      return selfMoves.moves;
    }

    /*
    console.log("Step " + this.vangaOptions.step + ", " +
                "HP " + this.gameData.self().health_points + ", " +
                (selfMoves.moves.slice(-1)[0]?.direction || "init"));
    console.log(this.gameData.genGrid().map(line => line.join(" ")).join("\n"));
    console.log(new Array(this.gameData.width*2 - 1).fill("-").join(""));
    */
   
    const moves = this.findSelfMoves(true);

    for(let move of moves) {
      const childMoves = [...selfMoves.moves, move];
      let childGame = new Game(
        new GameData(this.gameData.raw),
        [{ id: selfMoves.id, moves: childMoves}],
        {
          depth: this.vangaOptions.depth,
          step: this.vangaOptions.step + 1,
          startTime: this.vangaOptions.startTime
        }
      );

      const childVanga = childGame.vanga();
      if(childVanga.length == this.vangaOptions.depth) {
        return childVanga;
      } else {
        if(maxPath.length < childVanga.length) {
          //console.log(childVanga);
          maxPath = childVanga;
        }
      }
    }

    if(this.first) {
      if(maxPath.length > 0) {
        return maxPath;
      } else if(moves.length > 0) {
        return [moves[0]];
      }
    }

    return selfMoves.moves;
  }

}

export default Game;