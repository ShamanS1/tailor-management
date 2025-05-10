import mongoose, {Document, Schema} from 'mongoose';

export interface CustomerDocument extends Document{
    name: string,
    email: string,
    password: string,
    phone: string,
    firebaseUid: string,
    role: string
}

const CustomerSchema: Schema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required:true},
    phone: {type:String, required: true},
    firebaseUid: {type: String, required: true},
    role: {type: String, required: true}
});

export default mongoose.model<CustomerDocument>('Customer', CustomerSchema);