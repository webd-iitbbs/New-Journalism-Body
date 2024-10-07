import React, { useState, useEffect } from 'react';
import { API } from '../store/utils/API';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await API.get("/api/v1/announcement/recent");
        console.log(response.data.data.announcements);
        setAnnouncements(response.data.data.announcements);
      } catch (error) {
        console.error("Error fetching announcements", error);
      }
    }
    fetchAnnouncements();
  }, []);

  const handleClick = (link) => {
    if (!link) return;
    window.open(link, "_blank"); // opens in a new tab
  };
  return (
    <div className="w-full bg-black text-white flex items-center justify-center overflow-hidden relative h-12">
      {/* Single container for both announcements */}
      <div className="whitespace-nowrap absolute animate-scroll ">
        {/* <span className="px-4 cursor-pointer">
          📢 NEW: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
        </span>
        <span className="px-4 cursor-pointer">🚨 ATTENTION: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.!</span> */}
        {announcements.map((announcement, index) => (
          <button key={index} className="px-4 cursor-pointer" onClick={() => { handleClick(announcement?.link) }}>
            {index === 0 ? "📢" : "🚨"}
            {announcement.title} :{" "}
            {announcement.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Announcement;
