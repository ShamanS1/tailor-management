// tailorRoutes.ts
import { Router } from 'express';
import { TailorController } from '../controllers/tailorController';

const router = Router();

router.get('/', TailorController.getAllTailors);
router.get('/uid/:firebaseUid', TailorController.getByUid);
router.post('/', TailorController.createTailor);
router.put('/:firebaseUid', TailorController.updateTailor);
router.delete('/:tailorId', TailorController.deleteTailor);
router.get('/:tailorId/review', TailorController.getReviews);
router.get('/dress/:dress', TailorController.getTailorsByDress);


export default router;
