import React from "react";

export default function BlogsPage() {
  return (
    <div className="bg-white font-sans">
      {/* Main Article Section */}
      <div className="max-w-full mx-auto px-6 sm:px-12 py-5">
        {/* Image Section */}
        <div className="w-full mb-10">
          <img
            src="/blog image.png"
            alt="Phishing Awareness"
            className="w-full"
          />
        </div>

        {/* Article Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            How to Spot a Phishing Website
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Learn to recognize phishing websites by spotting key red flags like
            unusual URLs, poor grammar, and unexpected pop-ups. This guide,
            complete with screenshots and examples, empowers you to identify
            and avoid online scams effectively.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Learn to recognize phishing websites by spotting key red flags like
            unusual URLs, poor grammar, and unexpected pop-ups. This guide,
            complete with screenshots and examples, empowers you to identify
            and avoid online scams effectively.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Learn to recognize phishing websites by spotting key red flags like
            unusual URLs, poor grammar, and unexpected pop-ups. This guide,
            complete with screenshots and examples, empowers you to identify
            and avoid online scams effectively.
          </p>
        </div>

        {/* Explore Blogs Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Explore Our Blogs
          </h2>

         
          </div>
        </div>
      </div>

  );
}
