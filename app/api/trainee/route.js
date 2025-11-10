import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";
import { ObjectId } from "mongodb";

// 📍 שליפת כל המתאמנים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainee");
  const trainees = await collection.find({}).toArray();
  return NextResponse.json(trainees);
}

// 📍 יצירת מתאמן חדש
export async function POST(request) {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainee");
  const data = await request.json();

  await collection.insertOne(data);
  return NextResponse.json({ message: "Trainee added successfully" });
}

// 📍 עדכון מתאמן לפי מזהה (_id)
export async function PUT(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainee");
    const data = await request.json();
    const { _id, ...updates } = data;
    const objectId = new ObjectId(_id);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trainee updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 📍 מחיקת מתאמן לפי מזהה (_id)
export async function DELETE(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainee");
    const data = await request.json();
    const { _id } = data;
    const objectId = new ObjectId(_id);
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trainee deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
