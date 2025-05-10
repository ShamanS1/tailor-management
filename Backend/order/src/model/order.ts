// Order.ts
import { Schema, model, Document } from 'mongoose';

export interface Order extends Document {
    firebaseUidc: string;
    firebaseUidt: string;
    shopName: string;
    placedDate: Date;
    deliveryDate: Date;
    orderStatus: string;
    amount: number;
    orderType: string;
    deliveryType: string;
    dresses: string[]; 
}

const orderSchema = new Schema<Order>({
    firebaseUidc: { type: String, required: true },
    firebaseUidt: { type: String, required: true },
    shopName: { type: String, required: true },
    placedDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date, required: true },
    orderStatus: { type: String, default: "pending" },
    amount: { type: Number, required: true },
    orderType: { type: String, required: true },
    deliveryType: { type: String, required: true },
    dresses: { type: [String], required: true },
});

const OrderModel = model<Order>('Order', orderSchema);

export default OrderModel;
