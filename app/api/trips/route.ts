import User from '@/models/User';
import Trip from '@/models/Trip';
import multer from 'multer';
import { connectToMongoDB } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { NextRequest, NextResponse } from "next/server";

const mkdir = promisify(fs.mkdir);

// Configure multer for multiple file uploads (array of images)
const storage = multer.diskStorage({
  destination: async function (req: any, file: any, cb: any) {
    const uploadDir = path.join(process.cwd(), 'public', 'en');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      return cb(new Error('Failed to create upload directory'), null);
    }
    cb(null, uploadDir);
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Helper to handle multer in Next.js API routes
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};

// Handle POST request to create or update a trip
export const POST = async (req: NextRequest) => {
  try {
    await connectToMongoDB(); // Connect to MongoDB

    const formData = await req.formData();
    
    const tripId = formData.get('tripId') as string; // Retrieve trip ID if updating
    const name = formData.get('name') as string; // Retrieve trip name
    const desc = formData.get('desc') as string; // Retrieve trip description
    const day = formData.get('day') as string; // Retrieve trip day(s)
    const price = formData.get('price') as string; // Retrieve trip price
    const email = formData.get('email') as string; // Retrieve user email
    const endDate = formData.get('endDate') as string; // Retrieve trip day(s)

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const files = formData.getAll('images') as Blob[]; // Get the array of files (images)
    const imagePaths: string[] = [];

    // Process new images if any
    if (files.length > 0) {
      for (const file of files) {
        const buffer = Buffer.from(await (file as Blob).arrayBuffer());
        const uniqueFileName = `${Date.now()}-${(file as File).name}`;
        const filePath = path.resolve('public', 'en', uniqueFileName);
        fs.writeFileSync(filePath, buffer);
        imagePaths.push(`/en/${uniqueFileName}`);
      }
    }

    // Update or create a trip
    if (tripId) {
      // Update existing trip
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
      }
      const endDates: Date = new Date(endDate); // Convert string to Date

      trip.name = name;
      trip.desc = desc;
      trip.day = day;
      trip.price = parseFloat(price);
      trip.endDate = endDates; 

      trip.images = [...trip.images, ...imagePaths]; // Append new images to existing ones
      await trip.save();
      
      return NextResponse.json(trip, { status: 200 });
    } else {
      // Create new trip
      const newTrip = new Trip({
        name,
        desc,
        day,
        endDate,
        price: parseFloat(price),
        images: imagePaths,
        user_id: user._id,
      });
      await newTrip.save();
      return NextResponse.json(newTrip, { status: 201 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, message: error }, { status: 500 });
  }
};

// Handle GET request to fetch trips for a user
export const GET = async (request: Request) => {
  try {
    await connectToMongoDB(); // Connect to MongoDB

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email'); // Retrieve user email from query parameters

    if (email) {

      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      const trips = await Trip.find({ user_id: user._id });
      if (!trips) {
        return NextResponse.json({ error: 'No trips found' }, { status: 404 });
      }
      return NextResponse.json({ trips }, { status: 200 });    

    
    }
      else{
        const trips = await Trip.find({});
        return NextResponse.json({ trips }, { status: 200 });    


  }
    
}catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
