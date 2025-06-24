import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database';
import Birdpedia from '../../../models/Birdpedia';

// GET - Search birds
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const family = searchParams.get('family');
    const order = searchParams.get('order');
    const habitat = searchParams.get('habitat');
    const conservationStatus = searchParams.get('conservationStatus');
    const isExtinct = searchParams.get('isExtinct');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build filters
    const filters = {};
    if (family) filters.family = family;
    if (order) filters.order = order;
    if (habitat) filters.habitat = habitat.split(',');
    if (conservationStatus) filters.conservationStatus = conservationStatus;
    if (isExtinct !== undefined) filters.isExtinct = isExtinct === 'true';

    // Search birds
    const birds = await Birdpedia.searchBirds(query, { ...filters, limit });
    
    // Get total count for pagination
    const total = await Birdpedia.countDocuments({
      $or: [
        { 'name.common': { $regex: query, $options: 'i' } },
        { 'name.scientific': { $regex: query, $options: 'i' } },
        { 'description.physical': { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ],
      ...filters
    });

    return NextResponse.json({
      birds,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Search birds error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new bird (admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    const birdData = await request.json();

    // Validate required fields
    if (!birdData.name?.common || !birdData.name?.scientific) {
      return NextResponse.json(
        { error: 'Common name and scientific name are required' },
        { status: 400 }
      );
    }

    // Check if bird already exists
    const existingBird = await Birdpedia.findOne({
      $or: [
        { 'name.common': birdData.name.common },
        { 'name.scientific': birdData.name.scientific }
      ]
    });

    if (existingBird) {
      return NextResponse.json(
        { error: 'Bird with this name already exists' },
        { status: 409 }
      );
    }

    // Create new bird
    const bird = new Birdpedia(birdData);
    await bird.save();

    return NextResponse.json({
      message: 'Bird added successfully',
      bird
    }, { status: 201 });

  } catch (error) {
    console.error('Add bird error:', error);
    
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