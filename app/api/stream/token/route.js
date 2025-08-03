// /app/api/stream/token/route.js
import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

export async function POST(req) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Missing Stream credentials' },
      { status: 500 }
    );
  }

  const serverClient = StreamChat.getInstance(apiKey, apiSecret);
  const token = serverClient.createToken(userId);

  return NextResponse.json({ token });
}
