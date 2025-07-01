import { Router } from "express";
import ProgramaController from "../controller/programaController.js";

const router = Router();

router.get("/", ProgramaController.index);

export default router