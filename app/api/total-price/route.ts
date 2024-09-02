import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db'; // Adjust path to your connectToMongoDB function
import User from '@/models/User'; // Adjust path to your User model
import Join from '@/models/Join'; // Adjust path to your Join model
import Trip from '@/models/Trip'; // Adjust path to your Trip model

export const GET = async (request: Request) => {
  await connectToMongoDB(); // Connect to MongoDB

  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email'); // Retrieve user email from query parameters

    if (!email) {
      return NextResponse.json({ error: 'Email query parameter is required' }, { status: 400 });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find all trips the user has joined and populate the trip details
    const joins = await Join.find({ user_id: user._id })
    
    // Calculate total price
    const totalPrice = joins.reduce((total, join) => {
      const tripPrice = join ? join.price : 0;
      return total + tripPrice;
    }, 0);

    return NextResponse.json({ totalPrice }, { status: 200 });
  } catch (error) {
    console.error('Error calculating total price:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
