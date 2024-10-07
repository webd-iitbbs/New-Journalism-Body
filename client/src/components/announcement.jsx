import React from 'react';

const Announcement = () => {
  return (
    <div className="w-full bg-black text-white flex items-center justify-center overflow-hidden relative h-12">
      {/* Single container for both announcements */}
      <div className="whitespace-nowrap absolute animate-scroll ">
        <span className="px-4 cursor-pointer">
          📢 NEW: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
        </span>
        <span className="px-4 cursor-pointer">🚨 ATTENTION: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.!</span>
      </div>
    </div>
  );
};

export default Announcement;
