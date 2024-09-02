import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToMongoDB } from '@/lib/db'; // Ensure this function is correctly defined
import Join from '@/models/Join';
import User from '@/models/User';
import Trip from '@/models/Trip';
export async function GET(req: NextRequest, { params }: { params: { email:string } }) {



  try {
    await connectToMongoDB();
    const { email } = params;
        if (email) {
    
          const user = await User.findOne({ email });
          if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }


      const joins = await Join.find({ user_id: user._id }).lean();
      const tripIds = joins.map(join => join.trip_id);
      
    //   // Find details of those trips
      const trips = await Trip.find({ _id: { $in: tripIds } }).lean();
  
      // Respond with the found documents
      return NextResponse.json({ trips }, {   status:  200 });
      // Respond with the saved document
  }} catch (error) {
    console.error('Error saving transaction data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
