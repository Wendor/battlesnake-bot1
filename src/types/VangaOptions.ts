import { TSnakeMoves } from "../global.types";

type TVangaOptions = {
  [index: string]: any;
  footPriority?: number;
  headPriority?: number;
  depth?: number;
  step?: number,
  snakeMoves?: TSnakeMoves[],
  startTime?: number
}

export default TVangaOptions;