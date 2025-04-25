import { Router } from "express";
import { jwtVerify } from "../middlewares/jwtVerify";
import { createSharableLink, getUserSharedBrain } from "../controllers/link.controllers";

const router  = Router();


router.route('/share').post(jwtVerify,createSharableLink);
router.route('/:hashedString').get(getUserSharedBrain);



export default router;