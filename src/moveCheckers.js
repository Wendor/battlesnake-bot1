module.exports = {
  // Ходы которые не убьют
  avaiabledMoves (gameData, moves) {
    let snakeBodies = [];
    
    for(let snake of gameData.snakes) {
      snakeBodies = [...snakeBodies, ...snake.coords];
    }

    return moves
      // Не ходить за границы поля
      .filter(move => {
        return  move.x < gameData.width &&
                move.x >= 0 &&
                move.y < gameData.height &&
                move.y >= 0
      })
      // Не ходить в себя и тела других змей
      .filter(move => !snakeBodies.find(coord => coord[0] == move.x && coord[1] == move.y));
  },

  headsDetection(gameData, moves) {
    // Очковать хедшота от длинных змей
    moves.forEach((move, i) => {
      for(let snake of gameData.snakes) {
        if(
          snake.id != gameData.self.id &&
          Math.abs(snake.coords[0][0] - move.x) <= 1 &&
          Math.abs(snake.coords[0][1] - move.y) <= 1 &&
          gameData.self.coords.length <= snake.coords.length
        ) {
          moves[i].order -= 0.2;
        }
      }
    });

    return moves;
  },

  // Направление до ближайшей жрачки
  foodDirection(gameData, moves) {

    if(gameData.food.length == 0 || gameData.self.health_points > 50) return moves;

    const closestFood = gameData.food
      .sort((a,b) => {
        return  (Math.abs(gameData.self.coords[0][0] - a[0]) + Math.abs(gameData.self.coords[0][1] - a[1])) -
                (Math.abs(gameData.self.coords[0][0] - b[0]) + Math.abs(gameData.self.coords[0][1] - b[1]));
      })[0];

      moves.forEach((move, idx) => {
        moves[idx].foodDistance = Math.abs(move.x - closestFood[0]) + Math.abs(move.y - closestFood[1]);
    });

    let foodMove = moves.sort((move1, move2) => move1.foodDistance - move2.foodDistance)[0];
    
    moves.forEach((move, i) => {
      if(move.direction == foodMove.direction) {
        move.order += 0.1;
      }
    });

    return moves;
  }
}