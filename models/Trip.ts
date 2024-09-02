import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the TripDocument interface
export interface TripDocument extends Document {
  name: string;
  desc: string;
  day: string;
  images: string[]; // Array of image URLs
  price: number;
  rating: number;
  endDate:Date;
  available: boolean;
  user_id: mongoose.Types.ObjectId;
}

// Define the Trip schema
const TripSchema: Schema<TripDocument> = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  day: { type: String, required: true },
  images: [{ type: String, default: '' }], // Array of image URLs
  price: { type: Number, required: true }, // Using Number type for price.
  rating: { type: Number, default: 0 }, // Set default rating value to 0.
  endDate: { type: Date,required: true }, // Default value set to true.
  available: { type: Boolean, default: true }, // Default value set to true.
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
}, { timestamps: true });

// Model creation, checking if model already exists to avoid re-compilation
const Trip: Model<TripDocument> = mongoose.models.Trip || mongoose.model<TripDocument>('Trip', TripSchema);

export default Trip;
