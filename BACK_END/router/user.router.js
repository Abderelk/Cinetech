import express from 'express';
import {
    signUp,
    login,
    checkAuth
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/checkAuth', checkAuth);

export default router;