    import express,{Router} from 'express';
    import { registerUser, loginUser, signOutUser, checkUser } from '../controllers/user.controllers';
import { jwtVerify } from '../middlewares/jwtVerify';

    const router = Router();


    router.route('/signup').post(registerUser)

    router.route('/login').post(loginUser);

    router.route('/signout').post(jwtVerify,signOutUser);

    router.route('/auth/verify').get(jwtVerify,checkUser);


    export default router;