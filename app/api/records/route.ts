import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { DailyRecord } from '@/types';

export async function GET(req: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection<DailyRecord>('daily_records');
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const query = month && year ? {
            date: {
                $regex: `^${year}-${month.toString().padStart(2, '0')}`,
            },
        } : {};

        const records = await collection.find(query).sort({ date: -1 }).toArray();
        return NextResponse.json(records, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection<DailyRecord>('daily_records');
        const body = await req.json();

        if (!body.date || typeof body.isCarUsed !== 'boolean') {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const record: DailyRecord = {
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(record);
        return NextResponse.json({ ...record, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection<DailyRecord>('daily_records');
        const body = await req.json();

        if (!body._id) {
            return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
        }

        const { _id, ...updateData } = body;
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) as any },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection<DailyRecord>('daily_records');
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) as any });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    }
}