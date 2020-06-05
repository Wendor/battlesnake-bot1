import { TMove, TSnakeMoves } from "../global.types";
import { GameData } from "../global.classes";

class Game {
  gameData: GameData;

  constructor(gameData: GameData, snakeMoves: TSnakeMoves[] = [], options: {} = {}) {
    this.gameData = gameData;
    if(snakeMoves.length > 0) {
      for(let sm of snakeMoves) {
        const snake = this.gameData.getSnakeByID(sm.id);
        for(let move of sm.moves) {
          snake.move(move, this.gameData.collideFood(move));
        }
      }
    }
  }

  findSelfMoves(): TMove[] {
    let moves = this.gameData.getMovesByID(this.gameData.you);

    // Healing
    if(this.gameData.self().health_points < 50) {
      moves = moves.map(move => this.gameData.calcFoodDistance(move));
      const minFoodDistance = Math.min(...moves.map(move => move.food_distance));
      moves.forEach((move, i) => {
        if(move.food_distance == minFoodDistance) {
          moves[i].order += 0.1;
        }
      });
    }

    moves = this.randomizeMoves(moves).sort((a, b) => b.order - a.order);
    
    return moves;
  }

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

}

export default Game;