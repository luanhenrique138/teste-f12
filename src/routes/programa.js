import { Router } from "express";
import ProgramaController from "../controller/programaController.js";
import multer from "multer";

const router = Router();
const upload = multer();

router.get("/", ProgramaController.index);
router.post("/cadastro", upload.single('imagemCapa'), ProgramaController.store);
router.get("/:id", ProgramaController.show);
router.delete("/delete/:id", ProgramaController.destroy)
router.put("/edit/:id", upload.single('imagemCapa'), ProgramaController.update)

export default router