import { Router } from "express";

import indexHandler from "./Handlers/Index";
import startHandler from "./Handlers/Start";
import moveHandler from "./Handlers/Move";
import endHandler from "./Handlers/End";

const router = Router();

router.get("/", indexHandler);
router.post("/start", startHandler);
router.post("/move", moveHandler);
router.post("/end", endHandler);

export default router;