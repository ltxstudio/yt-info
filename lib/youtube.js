import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyD7C3AbMWd1Xw-X-mPx3yCdKzd7vQ0S83w"; // Replace with your API Key

// Fetch channel data
export const fetchChannelData = async (channelId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          part: "snippet,contentDetails,statistics",
          id: channelId,
          key: YOUTUBE_API_KEY,
        },
      }
    );
    return response.data.items[0]; // Return channel data
  } catch (error) {
    console.error("Error fetching data from YouTube API", error);
    return null;
  }
};

// Fetch recent videos
export const fetchRecentVideos = async (channelId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          channelId: channelId,
          maxResults: 5,
          order: "date",
          key: YOUTUBE_API_KEY,
        },
      }
    );
    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching recent videos", error);
    return [];
  }
};

// Calculate earnings based on views
export const calculateEarnings = (views) => {
  // Average CPM range (Cost Per 1000 views)
  const CPM_MIN = 1;
  const CPM_MAX = 5;

  // Earnings calculation (in USD)
  const earningsMin = (views / 1000) * CPM_MIN;
  const earningsMax = (views / 1000) * CPM_MAX;

  return { earningsMin, earningsMax };
};

// Calculate Engagement Rate (likes + comments) / views
export const calculateEngagementRate = (statistics) => {
  const { likeCount, commentCount, viewCount } = statistics;
  if (viewCount === 0) return 0;
  const engagementRate = (parseInt(likeCount) + parseInt(commentCount)) / parseInt(viewCount);
  return engagementRate * 100; // Return as percentage
};

// Fetch the top performing video (based on views)
export const fetchTopPerformingVideo = async (channelId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: "snippet,statistics",
          chart: "mostPopular",
          regionCode: "US", // or based on target region
          maxResults: 1,
          key: YOUTUBE_API_KEY,
        },
      }
    );
    return response.data.items[0]; // Return the most popular video
  } catch (error) {
    console.error("Error fetching top performing video", error);
    return null;
  }
};
