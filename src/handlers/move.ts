import { Request, Response } from "express";
import { GameData, VangaMode } from "../global.classes";

import { performance } from 'perf_hooks';

const directionArrows = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→"
};

export default function (request: Request, response: Response) {
  const startTime = performance.now();
  const gameData: GameData = new GameData(request.body);

  const vm = new VangaMode(gameData, {startTime: startTime});
  const moves = vm.findPath();

  const move = moves[0] ? moves[0].direction : "up";
  const workTime = performance.now() - startTime;
  console.log("(" + moves.length + ") " + moves.map(move => directionArrows[move.direction]).join(" "));
  console.log('MOVE: ' + directionArrows[move] + ", " + workTime.toFixed(2) + "ms");
  response.status(200).send({
    move: move
  });
}