import { TSnakeMoves } from "../global.types";
import { GameData } from "../global.classes";

type TVangaOptions = {
  [index: string]: any;
  footPriority?: number;
  headPriority?: number;
  depth?: number;
  step?: number,
  snakeMoves?: TSnakeMoves[]
}

export default TVangaOptions;