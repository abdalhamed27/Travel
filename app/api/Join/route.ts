import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToMongoDB } from '@/lib/db'; // Ensure this function is correctly defined
import Join from '@/models/Join';
import User from '@/models/User';

// DELETE request handler
export async function GET(req: NextRequest, { params }: { params: { id: string,email:string } }) {



  try {
    await connectToMongoDB();
    const { email } = params;
    const { id } = params;

    if (!email || !id) {
      return NextResponse.json({ error: 'Missing email or id parameter' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const joins = await Join.find({
      trip_id: id,
      user_id: user._id,
    });

    if (joins.length === 0) {
      return NextResponse.json({ Joins: false }, { status: 200 });
    }

    return NextResponse.json({ Joins: true }, { status: 200 });

  } catch (error) {
    console.error('Error fetching join data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
