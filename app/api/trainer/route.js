import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";

// 📍 שליפת כל המאמנים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainer");
  const trainers = await collection.find({}).toArray();
  return NextResponse.json(trainers);
}

// 📍 יצירת מאמן חדש
export async function POST(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainer");
  const data = await request.json();

  await collection.insertOne(data);
  return NextResponse.json({ message: "Trainer added successfully" }, { status: 201 });
}

// 📍 עדכון מאמן לפי אימייל
export async function PUT(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainer");
  const data = await request.json();

  const { email, ...updates } = data;
  const result = await collection.updateOne({ email }, { $set: updates });

  if (result.modifiedCount === 0) {
    return NextResponse.json({ message: "Trainer not found or no changes made" }, { status: 404 });
  }

  return NextResponse.json({ message: "Trainer updated successfully" });
}

// 📍 מחיקת מאמן לפי אימייל
export async function DELETE(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainer");
  const { email } = await request.json();

  const result = await collection.deleteOne({ email });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Trainer not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Trainer deleted successfully" });
}
