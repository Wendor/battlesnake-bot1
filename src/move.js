const pathfind = require("./pathfind");

module.exports = (request, response) => {
  const gameData = request.body;
  //console.log(gameData);


  gameData.self = gameData.snakes.find(snake => snake.id == gameData.you);

  let moves = [
    { direction: "right", order: 1, x: gameData.self.coords[0][0] + 1, y: gameData.self.coords[0][1] },
    { direction: "down", order: 1, x: gameData.self.coords[0][0], y: gameData.self.coords[0][1] + 1 },
    { direction: "left", order: 1, x: gameData.self.coords[0][0] - 1, y: gameData.self.coords[0][1] },
    { direction: "up", order: 1, x: gameData.self.coords[0][0], y: gameData.self.coords[0][1] - 1 }
  ];

  moves = pathfind.avaiabledMoves(gameData, moves);
  moves = pathfind.headsDetection(gameData, moves);
  moves = pathfind.foodDirection(gameData, moves);

  console.log(moves);
  
  let maxOrder = moves.reduce((order, move) => {
    return Math.max(order, move.order)
  }, 0);

  moves = moves.filter(move => move.order == maxOrder);

  let move = moves.length ? moves[Math.floor(Math.random() * moves.length)].direction : "up";

  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}