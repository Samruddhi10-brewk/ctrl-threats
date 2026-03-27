import React from 'react';
import { collaborationData } from '../../constants/collaboration';

function CollaborationCard({ logo, details }) {
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center space-y-4 mb-8 w-full sm:w-[80%] md:w-[80%] lg:w-[1420px] lg:h-[380px] lg:p-[103px]"
      style={{
        minWidth: '300px',  
        height: 'auto',     
      }}
    >
      <img src={logo} alt="Logo" className="h-12 w-auto" />
      <p className="text-gray-700 text-lg text-left">{details}</p>
    </div>
  );
}

export default function CollaborationSection() {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full">
        <h2 className="text-3xl font-semibold text-center mb-8">In Collaboration With</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {collaborationData.map((item, index) => (
            <CollaborationCard key={index} logo={item.logo} details={item.details} />
          ))}
        </div>
      </div>
    </div>
  );
}
