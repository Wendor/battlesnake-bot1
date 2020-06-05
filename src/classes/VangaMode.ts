import { Game, GameData } from '../global.classes';
import { TVangaOptions, TMove } from '../global.types';

class VangaMode {
  gameData: GameData = null;
  options: TVangaOptions = {
    footPriority: 0.1,
    headPriority: 0.2,
    depth: 40,
    step: 1,
    snakeMoves: []
  };
  maxPath: TMove[] = [];
  first: boolean = false;

  constructor(gameData: GameData, options: TVangaOptions = {}) {
    this.gameData = gameData;
    for(let key in options) {
      this.options[key] = options[key];
    }
  }

  findPath(): TMove[] {
    const game = new Game(this.gameData, this.options.snakeMoves);
    let selfMoves = this.options.snakeMoves.find(sm => sm.id == this.gameData.you);

    if(!selfMoves) {
      this.first = true;
      selfMoves = { id: this.gameData.you, moves: []};
    }

    if(selfMoves.moves.length >= this.options.depth) {
      return selfMoves.moves;
    }
   
    const moves = game.findSelfMoves();

    for(let move of moves) {
      const childMoves = [...selfMoves.moves, move];
      let childVanga = new VangaMode(this.gameData, {
        depth: this.options.depth,
        step: this.options.step + 1,
        snakeMoves: [{ id: selfMoves.id, moves: childMoves}]
      })

      const childFindPath = childVanga.findPath();
      if(childFindPath.length == this.options.depth) {
        return childFindPath;
      } else {
        if(this.maxPath.length < childFindPath.length) {
          console.log(childFindPath);
          this.maxPath = childFindPath;
        }
      }
    }

    if(this.first) {
      return this.maxPath;
    }

    return [];
  }
}

export default VangaMode;