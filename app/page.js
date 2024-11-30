'use client';

import { useState } from 'react';

export default function ChannelInfo() {
  const [channelId, setChannelId] = useState('');
  const [channelData, setChannelData] = useState(null);

  const fetchChannelInfo = async () => {
    const res = await fetch(`/api/channel-info?channelId=${channelId}`);
    const data = await res.json();
    setChannelData(data.items?.[0] || null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Channel Info</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Channel ID"
          className="border p-2 flex-1"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        <button
          onClick={fetchChannelInfo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fetch Info
        </button>
      </div>
      {channelData && (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold">{channelData.snippet.title}</h2>
          <p>{channelData.snippet.description}</p>
          <ul className="mt-4">
            <li>Subscribers: {channelData.statistics.subscriberCount}</li>
            <li>Views: {channelData.statistics.viewCount}</li>
            <li>Videos: {channelData.statistics.videoCount}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
