import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToMongoDB } from '@/lib/db'; // Ensure this function is correctly defined
import Join from '@/models/Join';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectToMongoDB();

    // Parse the JSON body
    const { email, owner_id, trip_id, payment_id, price, Transaction_id,persons,phone } = await request.json();

    // Basic validation
    if (!email || !owner_id || !trip_id || !payment_id || !price || !Transaction_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create a new Join document
    const newJoin = new Join({
      user_id: user._id, // User's ObjectId
      payment_id,
      trip_id: new mongoose.Types.ObjectId(trip_id), // Ensure Join_id is a valid ObjectId
      price,
      StillCurrent: true,
      persons:persons, // Set default value
      Transaction_id,
      phone:phone,
      owner_id:owner_id
    });

    // Save the new document to the database
    const savedJoin = await newJoin.save();

    // Respond with the saved document
    return NextResponse.json({ message: 'Transaction data saved successfully', data: savedJoin }, { status: 201 });
  } catch (error) {
    console.error('Error saving transaction data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
