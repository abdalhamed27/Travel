'use server';

import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToMongoDB } from '@/lib/db';
import fs from 'fs';
import path from 'path';
// GET Profile Data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await connectToMongoDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({message:true,user:user});
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


