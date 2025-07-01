import { Router } from "express";

import programaRouter from './programa.js'

const router = Router();

router.use("/programas", programaRouter);

export default router;
