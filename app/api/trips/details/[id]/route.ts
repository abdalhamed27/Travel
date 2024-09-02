import { NextRequest, NextResponse } from 'next/server';
import Trip from '@/models/Trip';
import { connectToMongoDB } from '@/lib/db';
import mongoose from 'mongoose';
import Join from '@/models/Join';
import TripRating from '@/models/TripRating';

// DELETE request handler
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToMongoDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing trip ID' }, { status: 400 });
    }

    const deletedTrip = await Trip.findByIdAndDelete(id);
    if (!deletedTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Trip deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete the trip'},
      { status: 500 }
    );
  }
}

// DELETE request handler
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to the database
    await connectToMongoDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Invalid or missing trip ID' }, { status: 400 });
    }

    const trip = await Trip.findById(id);
    let result = await Join.aggregate([
        { $match: { trip_id:trip?._id } },
        { $group: {
            _id: '$trip_id',
            persons: { $sum: '$persons' }
          }
        }
      ]);
      const averageRating = await TripRating.aggregate([
        { $match: { tripId: trip?._id } },
        { $group: {
            _id: '$tripId',
            averageRating: { $avg: '$rating' }
          }
        }
      ]);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    let ava;
        if(averageRating.length !==0 ){
          ava=averageRating
    } else{
      ava=false
    }
    if(result.length===0 ){
      return NextResponse.json({ message: true,trip,result:false,averageRating:ava }, { status: 200 });
    } 
  
    return NextResponse.json({ message: true,trip,result, averageRating:ava}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete the trip' },
      { status: 500 }
    );
  }
}
