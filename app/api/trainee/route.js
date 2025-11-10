import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";

// 📍 שליפת כל המתאמנים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("User");
  const trainees = await collection.find({}).toArray();
  return NextResponse.json(trainees);
}

// 📍 יצירת מתאמן חדש
export async function POST(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("User");
  const data = await request.json();
  await collection.insertOne(data);
  return NextResponse.json({ message: "Trainee added successfully" });
}

// 📍 עדכון מתאמן לפי אימייל
export async function PUT(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("User");
  const data = await request.json();

  const { email, ...updates } = data;
  const result = await collection.updateOne({ email }, { $set: updates });

  if (result.modifiedCount === 0) {
    return NextResponse.json({ message: "Trainee not found or no changes made" }, { status: 404 });
  }

  return NextResponse.json({ message: "Trainee updated successfully" });
}

// 📍 מחיקת מתאמן לפי אימייל
export async function DELETE(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("User");
  const { email } = await request.json();

  const result = await collection.deleteOne({ email });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Trainee deleted successfully" });
}
