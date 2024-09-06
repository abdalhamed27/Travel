import { connectToMongoDB } from '@/lib/db';
import { signIn } from 'next-auth/react';

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
export const POST = async (req: NextRequest) => {
    try {
      await connectToMongoDB(); // Connect to MongoDB
  
      const formData = await req.formData();
      
      const password = formData.get('password') as string; // Retrieve trip name
     const email = formData.get('email') as string; // Retrieve user email
     const res = await signIn ('credentials', {
        redirect: false,
        email,
        password,
      });
  
        return NextResponse.json(res, { status: 201 });
     
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }
  };