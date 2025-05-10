// orderRoutes.ts
import { Router } from 'express';
import { OrderController } from '../controller/orderController';

const router = Router();

router.get('/tailor/:firebaseUidt', OrderController.getOrdersByTailor);
router.get('/customer/:firebaseUidc', OrderController.getOrdersByCustomer);
router.post('/', OrderController.postOrder);
router.get('/:orderId', OrderController.getOrderById);
router.put('/tailor/:orderId', OrderController.updateOrderByTailor);
router.put('/customer/:orderId', OrderController.updateOrderByCustomer);
router.delete('/customer/:orderId', OrderController.deleteOrderByCustomer);

export default router;
