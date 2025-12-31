import { Router } from 'express';
import { createUser, editUser, getUserByEmail } from '../controllers/userController';
import { validateCreateUser, validateUpdateUser, validateEmailQuery } from '../utils/validation';

const router = Router();

router.post('/new', validateCreateUser, createUser);
router.post('/edit/:userId', validateUpdateUser, editUser);
router.get('/', validateEmailQuery, getUserByEmail);

export default router;
