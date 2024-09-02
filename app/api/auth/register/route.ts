'use server';

import { hashPassword } from '@/lib/Auth';
import { connectToMongoDB } from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const userType = formData.get('userType') as string;
  const companyAddress = formData.get('companyAddress') as string;
   const companyName = formData.get('companyName') as string;

  // Basic validation
  if (!email || !email.includes('@') || !password || password.length < 7) {
    return NextResponse.json({ message: 'Invalid input: Email must be valid, and password must be at least 7 characters long.' }, { status: 422 });
  }

  const client = await connectToMongoDB();

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists.' }, { status: 409 });
    }
    const hashedPassword = await hashPassword(password);
  let  DataUser;
    if(userType==="normal"){
       DataUser={
        email:email,
        password:hashedPassword,
        userType:userType,
        username:username,
      }
      }
      else{
      
         DataUser={
          email:email,
          password:hashedPassword,
          userType:userType,
          role:userType,
          username:username,
          CName:companyName,
          CAddress:companyAddress

        }
      }
   

  
    // Hash the password and insert new user
    await User.create(DataUser);

    return NextResponse.json({ message: 'User created successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'An error occurred while creating the user.' }, { status: 500 });
  } finally {
    // No need to close the connection manually, Mongoose manages it
  }
}
