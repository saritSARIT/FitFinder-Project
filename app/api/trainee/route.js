import { NextResponse } from "next/server";
import { client } from "../../../services/server/mongo";
import { ObjectId } from "mongodb";
import { TraineeSchema } from "../../../models/Trainee";

// שליפת כל המתאמנים
export async function GET() {
  const db = client.db("FitFinder");
  const collection = db.collection("Trainee");
  const trainees = await collection.find({}).toArray();
  return NextResponse.json(trainees);
}

// יצירת מתאמן חדש
export async function POST(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainee");
    const data = await request.json();

    // שלב הולידציה
    const parsed = TraineeSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(e => e.message);
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const existing = await collection.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Trainee added successfully" });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// עדכון מתאמן לפי מזהה (_id)
export async function PUT(request) {
  try {
    const db = client.db("FitFinder");
    const collection = db.collection("Trainee");
    const data = await request.json();
    const { _id, ...updates } = data;

    // שלב הולידציה
    const parsed = TraineeSchema.safeParse(updates);
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
      return NextResponse.json({ message: "Trainee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trainee updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// מחיקת מתאמן לפי מזהה (_id)
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
