import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import UserHistory from '../../../../models/UserHistory';

// GET - Get user statistics
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user stats from UserHistory collection
    const stats = await UserHistory.getUserStats(userId);
    
    // Get most identified species
    const mostIdentifiedSpecies = await UserHistory.getMostIdentifiedSpecies(userId, 5);

    // Get recent activity (last 5 entries)
    const recentActivity = await UserHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Get user profile data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: user.toJSON(),
      stats,
      mostIdentifiedSpecies,
      recentActivity
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user stats
export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, stats } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user stats
    if (stats) {
      Object.assign(user.stats, stats);
      await user.save();
    }

    return NextResponse.json({
      message: 'User stats updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Update user stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 