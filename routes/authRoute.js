import express from 'express'
import {registerController, loginController, testController, forgetPasswordController} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post("/register", registerController)

// LOGIN || METHOD POST
router.post("/login", loginController)

// TEST 
router.get("/test", requireSignIn, isAdmin, testController);

// Forget Password || METHOD POST
router.post("/forget-password", forgetPasswordController);
// protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
})
// protected admin auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
})

export default router;