'use client';

import { useState, useEffect } from "react";
import { fetchChannelData, fetchRecentVideos, calculateEarnings, calculateEngagementRate, fetchTopPerformingVideo } from "../lib/youtube";
import { Line, Bar } from "react-chartjs-2"; 
import { Chart as ChartJS } from "chart.js";
import { VideoCard } from "../components/VideoCard";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/Button";

export default function Home() {
  const [channelId, setChannelId] = useState("UCxH0sQJKG6Aq9-vFIPnDZ2A");
  const [channelData, setChannelData] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [topVideo, setTopVideo] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [engagementRate, setEngagementRate] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for better UX

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchChannelData(channelId);
        if (data) {
          setChannelData(data);
          const videos = await fetchRecentVideos(channelId);
          setRecentVideos(videos);

          const topVideoData = await fetchTopPerformingVideo(channelId);
          setTopVideo(topVideoData);

          // Calculate earnings and engagement
          setEarnings(calculateEarnings(data.statistics.viewCount));
          setEngagementRate(calculateEngagementRate(data.statistics));
        }
      } catch (err) {
        setError("Error fetching channel data.");
      } finally {
        setIsLoading(false); // Hide the spinner once data is fetched
      }
    };
    getData();
  }, [channelId]);

  // Create data for graphs (views over time and earnings projection)
  const viewsOverTimeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
    datasets: [
      {
        label: "View Count Over Time",
        data: [1000, 1200, 1100, 1300, 1400, 1500, 1700, 1600, 1800, 2000, 2100, 2500], // Sample view counts
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const earningsProjectionData = {
    labels: ["Q1", "Q2", "Q3", "Q4"], // Quarterly earnings projection
    datasets: [
      {
        label: "Earnings Projection",
        data: [
          earnings ? earnings.earningsMin : 0,
          earnings ? earnings.earningsMax : 0,
          earnings ? earnings.earningsMin * 1.2 : 0,
          earnings ? earnings.earningsMax * 1.2 : 0,
        ],
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">YouTube Channel Analytics</h1>

      {/* Search Input */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="border p-2 w-full sm:w-80 mr-2 rounded-md"
          placeholder="Enter YouTube Channel ID"
        />
        <Button text="Search" onClick={() => setChannelId(channelId)} />
      </div>

      {isLoading ? (
        <Spinner /> // Show loading spinner while data is being fetched
      ) : (
        <>
          {/* Channel Info */}
          {channelData && (
            <div className="channel-info text-center mb-6">
              <h2 className="text-2xl font-semibold">{channelData.snippet.title}</h2>
              <img
                src={channelData.snippet.thumbnails.medium.url}
                alt={channelData.snippet.title}
                className="rounded-lg my-4"
              />
              <p>{channelData.snippet.description}</p>
              <p><strong>Subscribers:</strong> {channelData.statistics.subscriberCount}</p>
              <p><strong>Views:</strong> {channelData.statistics.viewCount}</p>
              <p><strong>Videos:</strong> {channelData.statistics.videoCount}</p>
              <p><strong>Engagement Rate:</strong> {engagementRate.toFixed(2)}%</p>

              {/* Earnings Display */}
              {earnings && (
                <div className="my-4">
                  <h3 className="text-xl font-semibold">Estimated Monthly Earnings:</h3>
                  <p>Min: ${earnings.earningsMin.toFixed(2)} - Max: ${earnings.earningsMax.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* Graphs */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">View Count Over Time</h3>
            <Bar data={viewsOverTimeData} options={{ responsive: true }} />
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">Earnings Projection</h3>
            <Line data={earningsProjectionData} options={{ responsive: true }} />
          </div>

          {/* Top Performing Video */}
          {topVideo && (
            <div className="top-video my-6">
              <h3 className="text-xl font-semibold mb-4">Top Performing Video</h3>
              <VideoCard video={{
                id: topVideo.id,
                title: topVideo.snippet.title,
                description: topVideo.snippet.description,
                thumbnail: topVideo.snippet.thumbnails.medium.url,
                publishedAt: topVideo.snippet.publishedAt,
              }} />
            </div>
          )}

          {/* Recent Videos */}
          {recentVideos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Recent Videos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
