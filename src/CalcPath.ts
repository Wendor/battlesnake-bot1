import { GameData, Game } from "./Global";
import { performance } from 'perf_hooks';

/**
 * Запуск воркеров, ожидающих пути для расчета
 */
export default function() {
  console.log("Worker " + process.env.id + " loaded");
  process.on('message', message => {
    
    const startTime = performance.now();
    const gameData: GameData = new GameData(message.gameData);

    const selfMoves = [{id: gameData.you, moves: [message.move]}];

    const game = new Game(gameData, selfMoves, {
      startTime: startTime,
      depth: Math.max(
        (gameData.width + gameData.height)*2,
        gameData.self().coords.length*2,
        gameData.self().health_points
      ),
      step: 1
    });
  
    const moves = game.vanga();
    const iterationsDone = game.getVangaCounter();

    process.send({moves: moves, iterations: iterationsDone});
  });
}