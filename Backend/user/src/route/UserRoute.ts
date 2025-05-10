import { Router } from 'express';
import { addUser, getUser } from '../controller/UserController';

const router = Router();

router.post('/', addUser);
router.get('/:firebaseUid', getUser as any);


export default router;
