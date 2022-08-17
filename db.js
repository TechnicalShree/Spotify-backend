import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("connected to database successfuly...");
  } catch (e) {
    console.log("Not able to connect database :- " + e);
  }
};
