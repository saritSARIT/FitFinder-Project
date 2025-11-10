// app/services/server/mongo.ts
import { MongoClient, ServerApiVersion } from "mongodb";

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

if (!user || !password) throw new Error("Missing MongoDB credentials in .env");

const uri = `mongodb+srv://${user}:${password}@fitfinder.mpjxiuc.mongodb.net/?appName=FitFinder`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async () => {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
})();
