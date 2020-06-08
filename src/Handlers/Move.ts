import { Request, Response } from "express";
import { GameData, Game, ExtRequest, TMove } from "../Global";

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
 * @param {ExtRequest} request
 * @param {Response} response
 */
export default function (request: ExtRequest, response: Response) {
  const startTime = performance.now();
  const gameData: GameData = new GameData(request.body);

  const game = new Game(gameData, [], {
    startTime: startTime
  });

  let avaiabledMoves = game.findSelfMoves();
  let answers: { moves: TMove[], iterations: number }[] = [];
  let answerListener = (msg: { iterations: number, moves: TMove[] }) => answers.push(msg);
  avaiabledMoves.forEach((move, index) => {
    request.workers[index]?.send({id: index, gameData: gameData.raw, move: move});
    request.workers[index]?.on('message', answerListener);
  });

  // Ждем ответов от воркеров
  let interval = setInterval(() => {
    if(answers.length != avaiabledMoves.length) return;
    clearInterval(interval);
    request.workers.forEach(worker => worker.removeListener('message', answerListener));
    answers = answers.sort((ans1, ans2) => ans2.moves.length - ans1.moves.length);

    const moves = answers[0] ? answers[0].moves : [];
  
    const move = moves[0] ? moves[0].direction : "up";
    const workTime = performance.now() - startTime;
  
    const iterationsDone = answers.map(ans=>ans.iterations).join(',')
    //console.log("(" + moves.length + ") " + moves.map(move => directionArrows[move.direction]).join(" "));
    console.log("("+iterationsDone+ ") iterations. Found move chain " + moves.length + ". " + directionArrows[move] + ", " + workTime.toFixed(2) + "ms");
    response.status(200).send({
      move: move
    });
  }, 5)
}