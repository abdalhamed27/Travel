    import mongoose, { Document, Schema, Model } from 'mongoose';

    export interface JoinDocument extends Document {
    user_id: mongoose.Types.ObjectId;
    payment_id: string;
    trip_id: mongoose.Types.ObjectId;
    owner_id: mongoose.Types.ObjectId;
    price: number;
    phone: string;
    persons: number;
    StillCurrent: boolean;
    Transaction_id:string; // Reference to the User model
    }

    // Define the Join schema with field definitions
    const JoinSchema: Schema<JoinDocument> = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    payment_id: { type: String, required: true },
    owner_id:{ type: mongoose.Schema.Types.ObjectId, required: true },
    trip_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true },
    phone: { type: String, required: true },
    persons:{type:Number, default: 1},
    StillCurrent: { type:Boolean, default: true },
    Transaction_id:{ type: String, required: true },// Reference to the User model
    }, { timestamps: true });

    // Model creation, checking if model already exists to avoid re-compilation
    const Join: Model<JoinDocument> = mongoose.models.Join || mongoose.model<JoinDocument>('Join', JoinSchema);

    export default Join;
