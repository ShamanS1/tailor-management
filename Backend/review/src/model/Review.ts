import mongoose, {Schema, Document} from 'mongoose';

export interface ReviewDoc extends Document {
    firebaseUidc: string,
    firebaseUidt: string,
    rating: number,
    comment: string,
}

const reviewSchema = new Schema<ReviewDoc>({
    firebaseUidc: {type: String, required: true},
    firebaseUidt: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, required: false}
});

export default mongoose.model<ReviewDoc>('Review', reviewSchema);