'use server'
import { NextRequest, NextResponse } from 'next/server';
import {connectToMongoDB} from '@/lib/db';
import User from '@/models/User';
import Join from '@/models/Join';
interface TripDetails {
  name: string;
  // Add other fields if needed
}

interface TripStatistics {
  tripDetails: TripDetails;
  joinCount: number;
  totalRevenue: number;
}

interface TripStatisticsMap {
  [tripName: string]: TripStatistics;
}
export async function GET(req: NextRequest) {
  await connectToMongoDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  try {
    if (!email) {
      return NextResponse.json({ message: 'Email parameter is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const joins = await Join.find({ owner_id: user._id })
      .populate({
        path: 'trip_id',
        model: 'Trip',
      })
      .populate('user_id');

    if (!joins.length) {
      return NextResponse.json({ message: 'No joins found for this user' }, { status: 404 });
    }

    const totalJoins = joins.length;
    const totalRevenue = joins.reduce((total, join) => total + join.price, 0);

    // const tripStatistics = joins.reduce((stats, join) => {
    //   const trip = join.trip_id as any; // Type assertion to handle TypeScript type issue
    //   const tripName = trip?.name;
    //   if (!stats[tripName]) {
    //     stats[tripName] = {
    //       tripDetails: trip,
    //       joinCount: 0,
    //       totalRevenue: 0,
    //     };
    //   }
    //   stats[tripName].joinCount += 1;
    //   stats[tripName].totalRevenue += join.price;
    //   return stats;
    // }, {});

    // const revenueOverTime = joins.reduce((acc, join) => {
    //   const date = new Date(join.createdAt).toISOString().slice(0, 10);
    //   if (!acc[date]) {
    //     acc[date] = 0;
    //   }
    //   acc[date] += join.price;
    //   return acc;
    // }, {});

    // const revenueOverTimeArray = Object.keys(revenueOverTime).map(date => ({
    //   date,
    //   revenue: revenueOverTime[date],
    // }));

    // return NextResponse.json({
    //   totalJoins,
    //   totalRevenue,
    //   tripStatistics,
    //   revenueOverTime: revenueOverTimeArray,
    // });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  }
}
