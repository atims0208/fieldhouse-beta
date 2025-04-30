import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add basic API health check
    const apiHealth = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.ok);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      apiConnection: apiHealth ? 'connected' : 'disconnected',
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      apiConnection: 'disconnected',
    }, {
      status: 503,
    });
  }
} 