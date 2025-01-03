// models/Admin.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

const AdminSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);