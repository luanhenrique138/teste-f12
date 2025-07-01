import { Router } from "express";
import programaRouter from './programa.js'
import authMiddleware from "../middleware/authMiddleware.js";


const router = Router();

router.use(authMiddleware)

router.use("/programas", programaRouter);

export default router;
