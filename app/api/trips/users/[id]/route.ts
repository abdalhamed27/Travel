import { NextRequest, NextResponse } from 'next/server';
import Trip from '@/models/Trip';
import { connectToMongoDB } from '@/lib/db';
import mongoose from 'mongoose';
import Join from '@/models/Join';
import TripRating from '@/models/TripRating';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToMongoDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing trip ID' }, { status: 400 });
    }

    const trip = await Join.aggregate([
        { $match: { trip_id: new mongoose.Types.ObjectId(id) } }, 
          
        // Limit the result to the top N users
        // Optionally, lookup the actual user details if needed
        {
            $lookup: {
              from: 'users', // Name of the User collection in MongoDB
              localField: 'user_id', // Field from the Join collection
              foreignField: '_id', // Field from the User collection
              as: 'userDetails' // Alias for the joined data
            }
          },
          // Optionally, unwind the userDetails array to get a flat structure
          { $unwind: '$userDetails' }
      ]);
   
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
   
  
    return NextResponse.json({ message: true,trip}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete the trip' },
      { status: 500 }
    );
  }
}
