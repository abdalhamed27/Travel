import User from '@/models/User';
import multer from 'multer';
import { connectToMongoDB } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from '@/lib/Auth';
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
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('profileImage') as Blob | null; // Get the file from FormData
    const email = formData.get('email') as string ; // Get the file from FormData
    const username = formData.get('username') as string ; // Get the file from FormData
    const oldPassword = formData.get('oldPassword') as string ; // Get the file from FormData
    const newPassword = formData.get('newPassword') as string ; // Get the file from FormData
    const CName = formData.get('CName') as string ; // Get the file from FormData
    const CAddress = formData.get('CAddress') as string ; // Get the file from FormData
    
    const HashPassword = formData.get('HashPassword') as string ; // Get the file from FormData


    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }

    // Create a buffer from the file's arrayBuffer
    const buffer = Buffer.from(await file.arrayBuffer());

   
    // Generate a unique file name to prevent conflicts
    const uniqueFileName = `${Date.now()}-${(file as File).name}`;

    // Save the file to the uploads directory
    // const filePath = path.resolve(UPLOAD_DIR, uniqueFileName);
    const filePath = path.resolve('public', 'en', uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    // Return success response with file info
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    let updateData: any ={ username}
    if(uniqueFileName){
      updateData.profileImage=uniqueFileName ;
    }
    if (newPassword) {
      const verifyPasswords = await verifyPassword(oldPassword,HashPassword);
      if (!verifyPasswords) {
        return NextResponse.json({ success: false, message: "No password",p:verifyPasswords });
      } 
     let hasspasword = await hashPassword(newPassword);
       updateData.password =hasspasword ;

        }
        if(CName){
          updateData.CName=CName
        }
        if(CAddress){
          updateData.CAddress=CAddress
        }
    

    await connectToMongoDB();



    const user = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: true, user }, { status: 201 });

  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ success: false, message: "File upload failed" });
  }
};
