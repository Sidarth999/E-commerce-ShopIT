import mongoose from "mongoose";

export const connectDatabase = async () => {
  let DB_URI = "";

  if(process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_LOCAL_URI;
  if(process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

  mongoose.connect(DB_URI).then((con) => {
    // console.log(`MongoDB connected successfully in ${process.env.NODE_ENV} mode`);
    console.log(`MongoDB database connected with HOST: ${con?.connection?.host}`);
  })
} 