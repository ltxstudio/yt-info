export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return new Response(JSON.stringify({ error: 'Channel ID is required' }), { status: 400 });
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await response.json();
  return new Response(JSON.stringify(data));
}
