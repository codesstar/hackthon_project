import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Lightbulb, Paperclip, MessageSquare, Sparkles, Home, Search, User, ArrowLeft } from 'lucide-react'; // Added new icons

// --- Video Data Configuration ---
// IMPORTANT: Place your video files in a folder named 'public/videos'
// For example, if you have 'video1.mp4' in 'public/videos', its src will be '/videos/video1.mp4'
const homePageContent = [
  { type: 'singleVideo', video: { id: 's1v1', title: "Adventure Time", summary: "Explore vast landscapes and thrilling moments.", src: "/videos/raena-brainrot.mp4" } },
  { type: 'singleVideo', video: { id: 's1v2', title: "Nature's Beauty", summary: "Stunning views of serene natural wonders.", src: "/videos/raena-brainrot copy.mp4" } },
  { type: 'singleVideo', video: { id: 's1v2', title: "Sandy Beaches", summary: "Wondrful water fronts and shores.", src: "/videos/raena-brainrot copy 2.mp4" } },
  {
    type: 'horizontalSeries',
    seriesTitle: "Storyline Alpha",
    videos: [
      { id: 's1v3a', title: "Chapter 1: The Beginning", summary: "The initial steps of a grand journey.", src: "/videos/story goggins.mp4" },
      { id: 's1v3b', title: "Chapter 2: The Challenge", summary: "Facing obstacles and overcoming fears.", src: "/videos/story goggins 2.mp4" }, // New placeholder video
      { id: 's1v3c', title: "Chapter 3: The Resolution", summary: "A satisfying conclusion to the adventure.", src: "/videos/story goggins 3.mp4" }, // New placeholder video
    ]
  },
  { type: 'singleVideo', video: { id: 's1v4', title: "Solo Journey", summary: "A lone traveler's reflective experience.", src: "/videos/raena-brainrot copy 3.mp4" } }, // New placeholder video
  { type: 'singleVideo', video: { id: 's1v4', title: "Dual Journey", summary: "A pair's exciting experience.", src: "/videos/raena-brainrot copy 4.mp4" } }, // New placeholder video
  {
    type: 'horizontalSeries',
    seriesTitle: "Deep Dive Collection",
    videos: [
      { id: 's2v1', title: "Ocean Waves", summary: "Calming sounds and sights of the sea.", src: "/videos/raena-brainrot copy 5.mp4" }, // New placeholder video
      { id: 's2v2', title: "Mountain Peaks", summary: "Breathtaking vistas from high altitudes.", src: "/videos/raena-brainrot copy 6.mp4" }, // New placeholder video
      { id: 's2v3', title: "Desert Sands", summary: "Unveiling the mystery of arid landscapes.", src: "/videos/raena-brainrot copy 7.mp4" }, // New placeholder video
      { id: 's2v4', title: "Forest Trails", summary: "Peaceful walks through lush green forests.", src: "/videos/raena-brainrot copy 8.mp4" }, // New placeholder video
    ]
  },
];

// Flatten all videos for the Explore page, regardless of their grouping on the home page
const allVideos = homePageContent.flatMap(item =>
  item.type === 'singleVideo' ? [item.video] : item.videos
);

// --- VideoPlayer Component ---
// Displays a single video with overlay icons and user/content info
const VideoPlayer = ({ video, isPlaying }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleCanPlayThrough = () => {
        if (isPlaying) {
          videoElement.play().catch(error => console.error("Video play failed (autoplay blocked or other issue):", error));
        }
      };

      // Add event listener to ensure video is ready before attempting to play
      videoElement.addEventListener('canplaythrough', handleCanPlayThrough);

      if (isPlaying) {
        // If already canplaythrough, try to play immediately
        if (videoElement.readyState >= 4) { // HAVE_ENOUGH_DATA
          videoElement.play().catch(error => console.error("Video play failed (autoplay blocked or other issue):", error));
        }
      } else {
        videoElement.pause();
      }

      // Cleanup listener
      return () => {
        videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, [isPlaying, video.src]); // Added video.src to dependency array to re-run effect if video source changes

  return (
    <div className="relative w-full h-full flex-shrink-0 snap-start bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={video.src}
        className="w-full h-full object-cover"
        loop
        playsInline // Important for iOS autoplay
        preload="auto"
      >
        Your browser does not support the video tag.
      </video>

      {/* Right-side icons */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-6">
        <button className="flex flex-col items-center text-white">
          <Lightbulb size={32} />
        </button>
        <button className="flex flex-col items-center text-white">
          <Paperclip size={32} />
        </button>
        <button className="flex flex-col items-center text-white">
          <MessageSquare size={32} />
        </button>
        <button className="flex flex-col items-center text-white">
          <Sparkles size={32} />
        </button>
      </div>

      {/* Left-side profile and video info */}
      <div className="absolute bottom-4 left-4 text-white drop-shadow-lg flex flex-col items-start">
        {/* Profile Picture */}
        <img
          src="https://placehold.co/40x40/FFFFFF/000000?text=P" // Placeholder profile image
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white mb-2"
        />
        {/* Video Topic */}
        <p className="text-lg font-bold mb-1">{video.title}</p>
        {/* Video Summary */}
        <p className="text-sm max-w-[200px] leading-tight">{video.summary}</p>
      </div>
    </div>
  );
};

// --- HorizontalScroller Component ---
// Manages horizontal scrolling and active video within a single series
const HorizontalScroller = ({ series, isActiveSeries, onVideoChange, currentActiveVideoIndex }) => {
  const scrollContainerRef = useRef(null);

  // Effect to scroll to the current video when index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const videoWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: currentActiveVideoIndex * videoWidth,
        behavior: 'smooth',
      });
    }
  }, [currentActiveVideoIndex]);

  // Handle scroll event to update current video index
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== currentActiveVideoIndex) {
        onVideoChange(newIndex); // Notify parent about video change
      }
    }
  }, [currentActiveVideoIndex, onVideoChange]);

  // Debounce the scroll event
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 150); // Adjust debounce time as needed
    };

    container.addEventListener('scroll', debouncedScroll);
    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide flex"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {series.videos.map((video, index) => (
        <VideoPlayer
          key={video.id}
          video={video}
          isPlaying={isActiveSeries && index === currentActiveVideoIndex}
        />
      ))}
    </div>
  );
};

// --- HomePage Component ---
const HomePage = () => {
  const scrollContainerRef = useRef(null);
  const [currentVerticalPageIndex, setCurrentVerticalPageIndex] = useState(0);
  const [activeHorizontalVideoIndex, setActiveHorizontalVideoIndex] = useState({}); // To track active video in horizontal series

  // Vertical scroll handling
  useEffect(() => {
    if (scrollContainerRef.current) {
      const pageHeight = scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({
        top: currentVerticalPageIndex * pageHeight,
        behavior: 'smooth',
      });
    }
  }, [currentVerticalPageIndex]);

  const handleVerticalScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, clientHeight } = scrollContainerRef.current;
      const newIndex = Math.round(scrollTop / clientHeight);
      if (newIndex !== currentVerticalPageIndex) {
        setCurrentVerticalPageIndex(newIndex);
      }
    }
  }, [currentVerticalPageIndex]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let timeoutId;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleVerticalScroll, 150);
    };
    container.addEventListener('scroll', debouncedScroll);
    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleVerticalScroll]);

  // Callback for HorizontalScroller to update its active video
  const handleHorizontalVideoChange = useCallback((seriesId, videoIndex) => {
    setActiveHorizontalVideoIndex(prev => ({
      ...prev,
      [seriesId]: videoIndex
    }));
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {homePageContent.map((item, verticalIndex) => (
        <div key={`vertical-page-${verticalIndex}`} className="w-full h-full flex-shrink-0 snap-start">
          {item.type === 'singleVideo' && (
            <VideoPlayer
              video={item.video}
              isPlaying={verticalIndex === currentVerticalPageIndex}
            />
          )}
          {item.type === 'horizontalSeries' && (
            <HorizontalScroller
              series={item} // Pass the entire series object
              isActiveSeries={verticalIndex === currentVerticalPageIndex}
              onVideoChange={(videoIndex) => handleHorizontalVideoChange(item.seriesTitle, videoIndex)}
              currentActiveVideoIndex={activeHorizontalVideoIndex[item.seriesTitle] || 0}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// --- ExplorePage Component ---
const ExplorePage = () => {
  const topSearches = ["Nature", "Travel", "Cooking", "Tech", "Art", "Music"];

  return (
    <div className="w-full h-full bg-white text-gray-800 p-4 overflow-y-auto pt-20">
      <h2 className="text-xl font-bold mb-4 text-center">Explore</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for topics..."
        className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Top Searches Carousel */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Searches</h3>
        <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
          {topSearches.map((topic, index) => (
            <span
              key={index}
              className="flex-shrink-0 bg-gray-200 text-gray-700 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Wall of Videos */}
      <div>
        <h3 className="text-lg font-semibold mb-2">All Videos</h3>
        <div className="grid grid-cols-2 gap-3">
          {allVideos.map(video => (
            <div key={video.id} className="relative w-full aspect-video bg-gray-300 rounded-lg overflow-hidden shadow-sm">
              <img
                src={`https://placehold.co/160x90/E0E0E0/333333?text=${video.title.replace(/\s/g, '+')}`} // Placeholder for video thumbnail
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-sm font-semibold">
                {video.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- UploadDocumentsPage Component ---
const UploadDocumentsPage = ({ onBack }) => {
  return (
    <div className="w-full h-full bg-white text-gray-800 p-4 flex flex-col pt-20">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold ml-2">Upload Custom Documents</h2>
      </div>

      <div className="flex-grow border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center p-6 text-gray-500">
        <p>Drag & Drop your course materials here, or click to browse.</p>
      </div>
    </div>
  );
};

// --- ProfilePage Component ---
const ProfilePage = () => {
  const [showUploadPage, setShowUploadPage] = useState(false);

  if (showUploadPage) {
    return <UploadDocumentsPage onBack={() => setShowUploadPage(false)} />;
  }

  return (
    <div className="w-full h-full bg-white text-gray-800 p-4 overflow-y-auto flex flex-col items-center pt-20">
      <h2 className="text-xl font-bold mb-6">Profile</h2>

      {/* Profile Picture */}
      <img
        src="https://placehold.co/100x100/CCCCCC/333333?text=User"
        alt="User Profile"
        className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4"
      />

      {/* Profile Info */}
      <p className="text-2xl font-bold mb-2">John Doe</p>
      <p className="text-gray-600 mb-6">"Creative content creator & explorer."</p>

      {/* Account Status */}
      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-6">
        Paid Account
      </span>

      {/* Content Buttons */}
      <div className="w-full flex justify-around mb-6">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm w-5/12">
          Saved Content
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm w-5/12">
          Liked Content
        </button>
      </div>

      {/* Upload Documents Button */}
      <button
        onClick={() => setShowUploadPage(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors w-full max-w-xs"
      >
        Upload Custom Documents
      </button>
    </div>
  );
};


// --- App Component ---
// Main application component, handles iPhone frame and tab switching
export default function App() {
  const [selectedTab, setSelectedTab] = useState('home'); // 'home', 'explore', 'profile'

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans antialiased">
      {/* iPhone Frame */}
      <div className="relative w-[319px] h-[635px] bg-black rounded-[50px] shadow-2xl overflow-hidden
                      border-[9px] border-black flex flex-col
                      before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2
                      before:w-[128px] before:h-[26px] before:bg-black before:rounded-b-2xl before:z-10
                      ">
        {/* Screen Content Area (takes all available height) */}
        <div className="flex-grow relative overflow-hidden">
          {renderContent()}
        </div>

        {/* Top Navigation Bar (Floating and Rounded) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex justify-around items-center
                        h-16 bg-black text-white rounded-full shadow-lg w-5/6 px-4">
          <button
            onClick={() => setSelectedTab('home')}
            className={`flex flex-col items-center justify-center w-1/3 h-full relative ${selectedTab === 'home' ? 'text-blue-400' : 'text-white'}`}
          >
            {selectedTab === 'home' && (
              <div className="absolute w-12 h-12 bg-gray-700 rounded-full opacity-60"></div>
            )}
            <Home size={24} className="relative z-10" />
          </button>
          <button
            onClick={() => setSelectedTab('explore')}
            className={`flex flex-col items-center justify-center w-1/3 h-full relative ${selectedTab === 'explore' ? 'text-blue-400' : 'text-white'}`}
          >
            {selectedTab === 'explore' && (
              <div className="absolute w-12 h-12 bg-gray-700 rounded-full opacity-60"></div>
            )}
            <Search size={24} className="relative z-10" />
          </button>
          <button
            onClick={() => setSelectedTab('profile')}
            className={`flex flex-col items-center justify-center w-1/3 h-full relative ${selectedTab === 'profile' ? 'text-blue-400' : 'text-white'}`}
          >
            {selectedTab === 'profile' && (
              <div className="absolute w-12 h-12 bg-gray-700 rounded-full opacity-60"></div>
            )}
            <User size={24} className="relative z-10" />
          </button>
        </div>
      </div>

      {/* Tailwind CSS scrollbar-hide utility (custom CSS for hiding scrollbars) */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
