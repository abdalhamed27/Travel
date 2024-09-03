import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import Join from '@/models/Join';
import User from '@/models/User';

// GET request handler
export async function GET(req: NextRequest) {
  try {
    await connectToMongoDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email || !id) {
      return NextResponse.json({ error: 'Missing email or id parameter' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const joinExists = await Join.exists({
      trip_id: id,
      user_id: user._id,
    });

    if (!joinExists) {
      return NextResponse.json({ Joins: false }, { status: 200 });
    }

    return NextResponse.json({ Joins: true }, { status: 200 });

  } catch (error) {
    console.error('Error fetching join data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}; 
