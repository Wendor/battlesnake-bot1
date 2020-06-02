const mc = require("./moveCheckers");

function findPath(gameData, iterations) {
  gameData.self = gameData.snakes.find(snake => snake.id == gameData.you);

  let moves = [
    { direction: "right", order: 1, x: gameData.self.coords[0][0] + 1, y: gameData.self.coords[0][1] },
    { direction: "down", order: 1, x: gameData.self.coords[0][0], y: gameData.self.coords[0][1] + 1 },
    { direction: "left", order: 1, x: gameData.self.coords[0][0] - 1, y: gameData.self.coords[0][1] },
    { direction: "up", order: 1, x: gameData.self.coords[0][0], y: gameData.self.coords[0][1] - 1 }
  ];

  moves = mc.avaiabledMoves(gameData, moves);
  moves = mc.headsDetection(gameData, moves);
  moves = mc.foodDirection(gameData, moves);

  let maxOrder = moves.reduce((order, move) => {
    return Math.max(order, move.order)
  }, 0);

  moves = moves.filter(move => move.order == maxOrder);
  if(!moves.length) return false;
  if(iterations == 0) return true;

  for(let move of moves.sort((a,b)=>0.5-Math.random())) {
    childGameData = { ...gameData };
    for(let snake of childGameData.snakes) {
      if(snake.id == gameData.self.id) {
        snake.coords.splice(-1,1);
        snake.coords = [[move.x, move.y], ...snake.coords];
        break;
      }
    }
    let validPath = findPath(childGameData, iterations - 1);
    if(validPath) {
      if(iterations == (gameData.width+gameData.height)*2) {
        return move;
      } else {
        return true;
      }
    }
  }
  if(iterations == (gameData.width+gameData.height)*2) return move;
  return false;
}

module.exports = findPath;