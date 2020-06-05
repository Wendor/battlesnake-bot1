import { Game, GameData } from '../global.classes';
import { TVangaOptions, TMove } from '../global.types';

import { performance } from 'perf_hooks';

let maxPath: TMove[] = [];

class VangaMode {
  gameData: GameData = null;
  options: TVangaOptions = {
    footPriority: 0.1,
    headPriority: 0.2,
    depth: 30,
    step: 1,
    snakeMoves: [],
    startTime: null
  };
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
      this.options.depth = Math.max(
        (this.gameData.width + this.gameData.height)*2,
        this.gameData.self().coords.length*2,
        this.gameData.self().health_points
      );
      maxPath = [];
      selfMoves = { id: this.gameData.you, moves: []};
    }

    if(selfMoves.moves.length >= this.options.depth) {
      return selfMoves.moves;
    }

    if(performance.now() - this.options.startTime >= 190) {
      if(this.first) {
        return maxPath;
      }
      return selfMoves.moves;
    }

    /*
    console.log("Step " + this.options.step + ", " +
                "HP " + this.gameData.self().health_points + ", " +
                (selfMoves.moves.slice(-1)[0]?.direction || "init"));
    console.log(this.gameData.genGrid().map(line => line.join(" ")).join("\n"));
    console.log(new Array(this.gameData.width*2 - 1).fill("-").join(""));
    */
   
    const moves = game.findSelfMoves(this.first);

    for(let move of moves) {
      const childMoves = [...selfMoves.moves, move];
      let childVanga = new VangaMode(new GameData(this.gameData.raw), {
        depth: this.options.depth,
        step: this.options.step + 1,
        snakeMoves: [{ id: selfMoves.id, moves: childMoves}],
        startTime: this.options.startTime
      })

      const childFindPath = childVanga.findPath();
      if(childFindPath.length == this.options.depth) {
        return childFindPath;
      } else {
        if(maxPath.length < childFindPath.length) {
          //console.log(childFindPath);
          maxPath = childFindPath;
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

export default VangaMode;