import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";
import { ObjectId } from "mongodb";
import { TrainerSchema } from "../../../models/Trainer";
import { p } from "framer-motion/client";

// שליפת כל המאמנים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainer");
  const trainers = await collection.find({}).toArray();
  return NextResponse.json(trainers);
}

// יצירת מאמן חדש
export async function POST(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainer");
    const data = await request.json();

    // שלב הולידציה
    const parsed = TrainerSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const existing = await collection.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Trainer added successfully" }, { status: 201 });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// עדכון מאמן לפי מזהה (_id)
export async function PUT(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainer");
    const data = await request.json();
    const { _id, ...updates } = data;

    // שלב הולידציה
    const parsed = TrainerSchema.safeParse(updates);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    if (parsed.data.email) {
      const existing = await collection.findOne({ email: parsed.data.email, _id: { $ne: new ObjectId(_id) } });
      if (existing) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
      }
    }

    const objectId = new ObjectId(_id);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: parsed.data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Trainer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trainer updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// מחיקת מאמן לפי מזהה (_id)
export async function DELETE(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainer");
    const data = await request.json();
    const { _id } = data;
    const objectId = new ObjectId(_id);
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Trainer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
