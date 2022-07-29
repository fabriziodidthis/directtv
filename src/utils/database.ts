import mongoose from "mongoose";
import log from "./logger";

async function connectDB() {
  const dbURI = process.env.DB_URI as string

  try {
    await mongoose.connect(dbURI)
    log.info('Connected to DB')
  } catch (error) {
    process.exit(1)
  }
}

export default connectDB