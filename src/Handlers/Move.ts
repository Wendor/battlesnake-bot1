import { Request, Response } from "express";
import { GameData, Game } from "../Global";

import { performance } from 'perf_hooks';

// Стрелочки для красивого отображения списка ходов
const directionArrows = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→"
};


/**
 * Хендлер для роута /move
 *
 * @export
 * @param {Request} request
 * @param {Response} response
 */
export default function (request: Request, response: Response) {
  const startTime = performance.now();
  const gameData: GameData = new GameData(request.body);

  const game = new Game(gameData, [], {
    startTime: startTime
  });
  const moves = game.vanga();

  const move = moves[0] ? moves[0].direction : "up";
  const workTime = performance.now() - startTime;
  console.log("(" + moves.length + ") " + moves.map(move => directionArrows[move.direction]).join(" "));
  console.log('MOVE: ' + directionArrows[move] + ", " + workTime.toFixed(2) + "ms");
  response.status(200).send({
    move: move
  });
}