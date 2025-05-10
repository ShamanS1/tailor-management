import express from 'express';
import { addReview, getReviews, pReview, nReview } from '../controller/ReviewController';

const router = express.Router();

router.post('/:firebaseUidc', addReview );
router.get('/:firebaseUidt', getReviews);
router.get('/p', pReview);
router.get('/n', nReview);

export default router;

