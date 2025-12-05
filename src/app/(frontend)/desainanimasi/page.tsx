// pages/index.tsx (or your preferred page route)
import React from 'react';

const data = [
  { url: "https://www.youtube.com/watch?v=7kwZz1k35W4" },
  { url: "https://www.youtube.com/watch?v=7kwZz1k35W4" },
  { url: "https://www.youtube.com/watch?v=7kwZz1k35W4" },
];

// Helper to extract YouTube video ID
const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideoCardsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center my-6">Animasi 3D</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => {
            const videoId = extractVideoId(item.url);
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {videoId ? (
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-red-500">Invalid YouTube URL</p>
                    <p className="text-sm text-gray-600 break-all">{item.url}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

