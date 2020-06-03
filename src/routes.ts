import { Router } from "express";

import indexHandler from "./handlers/index";
import startHandler from "./handlers/start";
import moveHandler from "./handlers/move";
import endHandler from "./handlers/end";

const router = Router();

router.get("/", indexHandler);
router.post("/start", startHandler);
router.post("/move", moveHandler);
router.post("/end", endHandler);

export default router;