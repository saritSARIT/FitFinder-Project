import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";

// 📍 שליפת כל האימונים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("Training");
  const trainings = await collection.find({}).toArray();
  return NextResponse.json(trainings);
}

// 📍 יצירת אימון חדש
export async function POST(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Training");
  const data = await request.json();

  await collection.insertOne(data);
  return NextResponse.json({ message: "Training added successfully" }, { status: 201 });
}

// 📍 עדכון אימון לפי מזהה (_id)
export async function PUT(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Training");
  const data = await request.json();

  const { _id, ...updates } = data;
  const { ObjectId } = require("mongodb");
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updates });

  if (result.modifiedCount === 0) {
    return NextResponse.json({ message: "Training not found or no changes made" }, { status: 404 });
  }

  return NextResponse.json({ message: "Training updated successfully" });
}

// 📍 מחיקת אימון לפי מזהה (_id)
export async function DELETE(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Training");
  const { _id } = await request.json();

  const { ObjectId } = require("mongodb");
  const result = await collection.deleteOne({ _id: new ObjectId(_id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Training not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Training deleted successfully" });
}
