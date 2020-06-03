import { GameData, Move } from "../global";

import { avaiabledMoves, headsDetection, foodDirection } from "./moveCheckers";


const findPath = (gameData: GameData, iterations: number): Move  => {
  gameData.self = gameData.snakes.find(snake => snake.id == gameData.you);

  let moves: Move[] = [
    { direction: "right", order: 1, x: gameData.self.coords[0][0] + 1, y: gameData.self.coords[0][1] },
    { direction: "down", order: 1, x: gameData.self.coords[0][0], y: gameData.self.coords[0][1] + 1 },
    { direction: "left", order: 1, x: gameData.self.coords[0][0] - 1, y: gameData.self.coords[0][1] },
    { direction: "up", order: 1, x: gameData.self.coords[0][0], y: gameData.self.coords[0][1] - 1 }
  ];

  moves = avaiabledMoves(gameData, moves);
  moves = headsDetection(gameData, moves);
  moves = foodDirection(gameData, moves);

  let maxOrder = moves.reduce((order, move) => {
    return Math.max(order, move.order)
  }, 0);

  moves = moves.filter(move => move.order == maxOrder);
  if(!moves.length) return null;
  if(iterations == 0) return moves[0];

  for(let move of moves.sort((a,b)=>0.5-Math.random())) {
    let childGameData: GameData = Object.assign({}, gameData);
    for(let snake of childGameData.snakes) {
      if(snake.id == gameData.self.id) {
        snake.coords.splice(-1,1);
        snake.coords = [[move.x, move.y], ...snake.coords];
        break;
      }
    }
    const validMove = findPath(childGameData, iterations - 1);
    if(validMove) return move;
  }
  if(iterations == (gameData.width+gameData.height)*2) return moves[0];
  return null;
}

export { findPath };