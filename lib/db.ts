
import mongoose from "mongoose";

let cachedConnection: mongoose.Connection | null = null;
const MONGO_URI = process.env.MONGO_URI ||  "mongodb+srv://mido:20112011mM@appes.q5ydng0.mongodb.net/?retryWrites=true&w=majority&appName=appes"


export async function connectToMongoDB() {
  // If a cached connection exists, return it
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }

  try {
    // Establish a new connection to MongoDB
    const cnx = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options you might need
    });
    
    // Cache the connection for future use
    cachedConnection = cnx.connection;

    // Log message indicating a new MongoDB connection is established
    console.log("New MongoDB connection established");

    // Return the newly established connection
    return cachedConnection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
