import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";
import { ObjectId } from "mongodb";
import { TrainingSchema } from "../../../models/Training";

// שליפת כל האימונים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("Training");
  const trainings = await collection.find({}).toArray();
  return NextResponse.json(trainings);
}

// יצירת אימון חדש
export async function POST(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Training");
    const data = await request.json();

    // שלב הולידציה
    const parsed = TrainingSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Training added successfully" }, { status: 201 });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// עדכון אימון לפי מזהה (_id)
export async function PUT(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Training");
    const data = await request.json();
    const { _id, ...updates } = data;

    // שלב הולידציה
    const parsed = TrainingSchema.safeParse(updates);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const objectId = new ObjectId(_id);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: parsed.data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Training not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Training updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// מחיקת אימון לפי מזהה (_id)
export async function DELETE(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Training");
    const data = await request.json();
    const { _id } = data;
    const objectId = new ObjectId(_id);
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Training not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Training deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
