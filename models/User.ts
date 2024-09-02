import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  username: string;
  CName: string;
  CAddress: string;
  userType:string;
  profileImage:string; // Store the image as a Base64 string or image URL

}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'owner'] },
  username: { type: String, required: true, trim: true },
  CName: { type: String, trim: true },
  CAddress: { type: String, trim: true },
  userType: { type: String, required: true, enum: ['normal', 'owner'] },
  profileImage: { type: String },
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
