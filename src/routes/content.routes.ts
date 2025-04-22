import { Router } from "express";
import { addNewContent, deleteContent, getAllContents } from "../controllers/content.controllers";
import { jwtVerify } from "../middlewares/jwtVerify";


const router = Router();

router.route('/').post(jwtVerify,addNewContent);
router.route('/').get(jwtVerify,getAllContents);
router.route('/').delete(jwtVerify,deleteContent);

export default router;