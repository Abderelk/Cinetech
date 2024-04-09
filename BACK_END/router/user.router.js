import express from 'express';
// importation des différentes fonctions 
import {
    signUp,
    login,
    checkAuth,
    logout
} from '../controllers/user.controller.js';
// routes pour gérer les utilisateurs
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/checkAuth', checkAuth);
router.get('/logout', logout);

export default router;