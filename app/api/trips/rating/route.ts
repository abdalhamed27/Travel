import { connectToMongoDB } from '@/lib/db';
import User from '@/models/User';
import TripRating from '@/models/TripRating';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
export const POST = async (req: NextRequest) => {
  try {
    await connectToMongoDB(); // Connect to MongoDB

    const formData = await req.formData();
    
    const tripId = formData.get('tripId') as string; // Retrieve trip ID if updating
    const rating = formData.get('rating') as string; // Retrieve trip name
   const email = formData.get('email') as string; // Retrieve user email
     const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }


      // Create new trip
      const newTrip = new TripRating({
        tripId,
        userId: user._id,
        rating
      });
      await newTrip.save();
      return NextResponse.json(newTrip, { status: 201 });
   
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
// Handle GET request to fetch trips for a user
export const GET = async (request: Request) => {
  try {
    await connectToMongoDB(); // Connect to MongoDB

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId'); // Retrieve user email from query parameters
    const result = await TripRating.aggregate([
      { $match: { tripId: tripId } },
      { $group: {
          _id: '$tripId',
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    return NextResponse.json({Rating:result}, { status: 201 });
  
    
}catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
