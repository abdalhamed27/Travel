import { NextRequest, NextResponse } from 'next/server';
import Trip from '@/models/Trip';
import { connectToMongoDB } from '@/lib/db';
import User from '@/models/User';
import Join from '@/models/Join';
import { Document } from 'mongoose';

export interface TripDocument extends Document {
  user_id: string;
  endDate: Date;
  createdAt: Date; // Add this line
  updatedAt: Date; // Add this line if necessary
  // other fields...
}
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToMongoDB();

    const { id } = params;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const currentDate = new Date();

    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing trip ID' }, { status: 400 });
    }

    // Find the user based on email
    const user = await User.findOne({ email: id });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Count total trips for the user
    const tripCount = await Trip.countDocuments({ user_id: userId });

    // Count all users associated with the user
    const allUserCount = await Join.countDocuments({ owner_id: userId });

    // Trips that ended before the current date
    const tripsEnded = await Trip.find({ user_id: userId, endDate: { $lt: currentDate } });

    // Trips that ended and were created within the current month
    const tripsEndedThisMonth = await Trip.find({
      user_id: userId,
      endDate: { $lt: currentDate },
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });
    

    // All trips created within the current month
    const tripsThisMonth = await Trip.find({
      user_id: userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }  as any
    });
    // Trips that are currently ongoing
    const tripsCurrent = await Trip.find({ user_id: userId, endDate: { $gte: currentDate } });

    // Ongoing trips created within the current month
    const tripsCurrentThisMonth = await Trip.find({
      user_id: userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }  as any ,
      endDate: { $gte: currentDate }
    });

    // Count results
    const tripCounts = tripsThisMonth.length;
    const tripsEndedCount = tripsEnded.length;
    const tripsEndedThisMonthCount = tripsEndedThisMonth.length;
    const tripsCurrentCount = tripsCurrent.length;
    const tripsCurrentThisMonthCount = tripsCurrentThisMonth.length;

    // Respond with the gathered data
    return NextResponse.json({
      message: true,
      tripCount,
      tripCounts,
      allUserCount,
      tripsEndedCount,
      tripsEndedThisMonthCount,
      tripsCurrentCount,
      tripsCurrentThisMonthCount
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching trip data:', error);
    return NextResponse.json({ error: 'Failed to fetch trip data' }, { status: 500 });
  }
}
