import mongoose, {Document, Schema} from 'mongoose';

export interface Dress{
    name: string;
    chest: number;
    waist: number;
    length: number;
    sleeve: number;
    inseam: number;
    collar: number;
    shoulder: number;
}
export interface MeasurementDocument extends Document {
    customerId: string;
    orderId: string;
    dressMeasures: Dress[];
}

const dressSchema: Schema = new Schema<Dress>({
    name: {type: String, required: true},
    chest: {type: Number, required: false},
    waist: {type: Number, required: false},
    length: {type: Number, required: false},
    sleeve: {type: Number, required: false},
    inseam: {type: Number, required: false},
    collar: {type: Number, required: false},
    shoulder: {type: Number, required: false}
});

const MeasurementSchema: Schema = new Schema ({
    customerId: {type: String, required: true},
    orderId: {type: String, required: true},
    dressMeasures: {type: [dressSchema], required: true}

});

export default mongoose.model<MeasurementDocument>('Measurement', MeasurementSchema);