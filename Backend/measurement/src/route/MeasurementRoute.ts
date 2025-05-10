import express from 'express';
import { getMeasurement, addMeasurement, updateMeasurement } from '../controller/MeasurementController';

const router = express.Router();

router.get('/:orderId', getMeasurement);
router.post('/', addMeasurement);
router.put('/:custId', updateMeasurement as any); 

export default router;
