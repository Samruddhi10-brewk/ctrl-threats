import React from 'react'
import {blogsData} from '../../../../constants/blogs';
import {LuMoveUpRight} from "react-icons/lu";

const BlogCard = ({blog}) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <div
                className="relative"
                style={{
                    backgroundImage: `url(${blog.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '190px',
                }}
            >
                <div className="flex items-center justify-center h-full">
                    <img src={blog.logo} alt="Logo" className="w-16 h-16" />
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{blog.heading}</h3>
                <p className="text-sm text-gray-600">{blog.details}</p>
                <a
                    href="#"
                    className="text-purple-600 font-semibold mt-4 inline-block"
                >
                    Read more
                    <span
                        className="inline-block transform"
                        style={{
                            display: 'inline-block',
                            transform: 'rotate(-50deg)',
                            fontSize: '1rem',
                        }}
                    >
                        →
                    </span>
                </a>
            </div>
        </div>
    );
};

export default function BlogSection() {
    return (
        <div className="max-w-7xl mx-auto px-5 py-12 mt-12 mb-16">
            <div className="text-center mb-12">
                <h2 className="text-6xl font-semibold text-gray-900 mb-4">
                    Explore our blogs
                </h2>
                <h4 className="text-sm text-gray-600">
                    For authoritative insights, industry trends, and strategic perspectives driving today’s innovations.
                </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogsData.map((blog, index) => (
                    <BlogCard key={index} blog={blog} />
                ))}
            </div>
        </div>
    );
};
