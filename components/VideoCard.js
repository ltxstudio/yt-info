const VideoCard = ({ video }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h4 className="font-semibold">{video.title}</h4>
      <p className="text-sm text-gray-600">{video.description}</p>
      <p className="text-xs text-gray-400 mt-2">{new Date(video.publishedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default VideoCard;
