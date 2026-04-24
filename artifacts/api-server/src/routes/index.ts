import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import itemsRouter from "./items";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(itemsRouter);
router.use(authRouter);

export default router;
