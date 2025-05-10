import mongoose, {Document, Schema} from 'mongoose';

export interface UserDocument extends Document{
    firebaseUid: string;
    name: string;
    role: string;
}

const UserSchema: Schema = new Schema ({
    firebaseUid: {type: String, required: true},
    name: {type: String, required: true},
    role: {type: String, required: true}
});

export default mongoose.model<UserDocument>('User', UserSchema);