import { NextResponse } from 'next/server';
import { connect } from '../../services/server/mongo';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const db = await connect();
    const trainings = await db.collection('trainings').find({}).toArray();
    return NextResponse.json({ ok: true, data: trainings });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // Basic validation
    if (!body || !body.title) {
      return NextResponse.json({ ok: false, error: 'Missing required field: title' }, { status: 400 });
    }

    const db = await connect();
    const res = await db.collection('trainings').insertOne({ ...body, createdAt: new Date() });
    return NextResponse.json({ ok: true, data: { insertedId: res.insertedId } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...update } = body || {};
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    }

    const db = await connect();
    const res = await db.collection('trainings').updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } });
    return NextResponse.json({ ok: true, data: { matchedCount: res.matchedCount, modifiedCount: res.modifiedCount } });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });
    }

    const db = await connect();
    const res = await db.collection('trainings').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true, data: { deletedCount: res.deletedCount } });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
