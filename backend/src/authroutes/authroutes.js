import express from 'express';
import * as auth from '../middlewares/auth.js'; // note the .js extension

const router = express.Router();
const register=auth.register;
const login=auth.login;

router.post("/register",register);
router.post("/login",login);

export default router;