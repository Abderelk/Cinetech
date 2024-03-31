import express from 'express';
import {
    signUp,
    userList,
    login,
    deleteUser, logout
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.get('/userList', userList);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/:username', deleteUser);

export default router;