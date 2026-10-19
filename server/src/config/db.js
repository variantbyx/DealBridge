import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge");
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Connection disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(`[MongoDB] Connection error event: ${err.message}`);
});

export default connectDB;
