import express from 'express';
import register, { validate } from './register.js';

const router = express.Router();

router.post('/register', validate, register);

export default router;
