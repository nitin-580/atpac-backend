// models/Blog.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId; // reference to Student/User
  tags?: string[];
  likes: mongoose.Types.ObjectId[]; // users who liked the blog
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // or "User"
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);
