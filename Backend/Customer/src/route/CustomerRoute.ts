import { Router } from 'express';
import { addCustomer, getAll, updateCustomer, deleteCustomer, getOrdersForCustomer, getCustomer } from '../controller/CustomerController';

const router = Router();

router.post('/', addCustomer);
router.get('/', getAll);
router.get('/uid/:firebaseUid', getCustomer as any);
router.get('/:customerId/orders', getOrdersForCustomer); // New endpoint
router.put('/:id', updateCustomer as any);
router.delete('/:id', deleteCustomer as any);

export default router;
