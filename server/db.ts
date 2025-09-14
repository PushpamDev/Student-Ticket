import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI not set - skipping Mongo connection");
    return;
  }
  await mongoose.connect(uri, { dbName: "institute_tickets" });
  console.log("MongoDB connected");
}
