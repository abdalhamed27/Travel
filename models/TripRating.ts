import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the TripRating schema
const tripRatingSchema = new Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the TripRating model
export default mongoose.models.TripRating || mongoose.model('TripRating', tripRatingSchema);
