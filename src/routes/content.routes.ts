import { Router } from "express";
import { addNewContent } from "../controllers/content.controllers";
import { jwtVerify } from "../middlewares/jwtVerify";


const router = Router();

router.route('/').post(jwtVerify,addNewContent);

export default router;