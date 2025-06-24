import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database';
import UserHistory from '../../../models/UserHistory';

// GET - Get user history
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'audio' or 'image'
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build query
    const query = { userId };
    if (type && ['audio', 'image'].includes(type)) {
      query.type = type;
    }

    // Get history with pagination
    const history = await UserHistory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    // Get total count for pagination
    const total = await UserHistory.countDocuments(query);

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new history entry
export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    const { userId, type, species, confidence, fileInfo, location, metadata, aiAnalysis } = data;

    // Validate required fields
    if (!userId || !type || !species || confidence === undefined) {
      return NextResponse.json(
        { error: 'User ID, type, species, and confidence are required' },
        { status: 400 }
      );
    }

    if (!['audio', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "audio" or "image"' },
        { status: 400 }
      );
    }

    if (confidence < 0 || confidence > 100) {
      return NextResponse.json(
        { error: 'Confidence must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Create new history entry
    const historyEntry = new UserHistory({
      userId,
      type,
      species,
      confidence,
      fileInfo,
      location,
      metadata,
      aiAnalysis
    });

    await historyEntry.save();

    // Populate user data
    await historyEntry.populate('userId', 'name email');

    return NextResponse.json({
      message: 'History entry created successfully',
      history: historyEntry
    }, { status: 201 });

  } catch (error) {
    console.error('Create history error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 