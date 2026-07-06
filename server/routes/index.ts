import { Router, type IRouter } from "express";
import healthRouter from "./health";
import modelsRouter from "./models";
import storageRouter from "./storage";
import leadsRouter from "./leads";
import availabilityRouter from "./availability";
import postsRouter from "./posts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(modelsRouter);
router.use(storageRouter);
router.use(leadsRouter);
router.use(availabilityRouter);
router.use(postsRouter);

export default router;
