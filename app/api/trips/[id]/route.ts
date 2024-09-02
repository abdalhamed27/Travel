import { NextRequest, NextResponse } from 'next/server';
import Trip from '@/models/Trip';
import { connectToMongoDB } from '@/lib/db';

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
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ message: true,trip }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete the trip'},
      { status: 500 }
    );
  }
}
