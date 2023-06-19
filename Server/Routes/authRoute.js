import express from 'express';
import { forgotPasswordController, loginController, registerController, testController, updateProfileController } from '../Controllers/authControllers.js';
import { requireSignIn } from '../Middlewares/authMiddleware.js'



const router = express.Router()


//route for REGITER in authController || POST
router.post('/register', registerController)


//route for login in authController || POST
router.post('/login', loginController)

//forgot password || POST
router.post('/forgot-password', forgotPasswordController)

//Dashboard protected route
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

router.put('/profile', requireSignIn, updateProfileController)

export default router;