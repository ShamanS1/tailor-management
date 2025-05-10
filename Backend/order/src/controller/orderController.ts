import { Request, Response } from 'express';
import OrderModel, { Order } from '../model/order';

export const OrderController = {
    getOrdersByTailor: async (req: Request, res: Response) => {
        const firebaseUidt = req.params.firebaseUidt;
        try {
            const orders = await OrderModel.find({ firebaseUidt:firebaseUidt });
            res.json(orders);
        } catch (error) {
            res.status(500).send('Server Error');
        }
    },

    getOrdersByCustomer: async (req: Request, res: Response) => {
        const firebaseUidc = req.params.firebaseUidc;
        try {
            const orders = await OrderModel.find({ firebaseUidc:firebaseUidc });
            res.json(orders);
        } catch (error) {
            res.status(500).send('Server Error');
        }
    },

    postOrder: async (req: Request, res: Response) => {
        const orderData: Partial<Order> = { ...req.body };
        try {
            const order = new OrderModel(orderData);
            const newOrder = await order.save();
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(400).send('Bad Request');
        }
    },

    updateOrderByTailor: async (req: Request, res: Response) => {
        const orderId = req.params.orderId;
        const updates = req.body;
        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updates, { new: true, runValidators: true });
            if (updatedOrder) {
                res.json(updatedOrder);
            } else {
                res.status(404).send('Order not found');
            }
        } catch (error) {
            res.status(500).send('Server Error');
        }
    },

    updateOrderByCustomer: async (req: Request, res: Response) => {
        const orderId = req.params.orderId;
        
        const updates = req.body;
    
        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updates, { new: true, runValidators: true }); // Added runValidators
            if (updatedOrder) {
                res.json(updatedOrder);
            } else {
                res.status(404).send('Order not found');
            }
        } catch (error) {
            console.error("Update Error:", error); // Log the error for debugging
            res.status(500).send('Server Error');
        }
    },

    //get the order by orderId
    getOrderById: async (req: Request, res: Response) => {
        const orderId = req.params.orderId;
        try {
            const order = await OrderModel.findById(orderId);
            if (order) {
                res.json(order);
            } else {
                res.status(404).send('Order not found');
            }
        } catch (error) {
            res.status(500).send('Server Error');
        }
    },

    //delete order by orderId
    deleteOrderByCustomer: async (req: Request, res: Response) => {
        const orderId = req.params.orderId;
        try {
            const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
            if (deletedOrder) {
                res.json(deletedOrder);
            } else {
                res.status(404).send('Order not found');
            }
        } catch (error) {
            res.status(500).send('Server Error');
        }
    },
};
