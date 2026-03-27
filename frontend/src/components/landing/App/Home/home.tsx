import { homeData } from "../../../../constants/home";
import { BsArrowUpRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home1() {

    const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentHeadingIndex((prevIndex) => (prevIndex + 1) % homeData.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const data = homeData[currentHeadingIndex];


    return (
        <div className="relative w-full mx-auto min-h-[30vh] h-full xl:h-[80vh] xl:my-6 my-0">
            <img
                src={data.image}
                alt="Hero"
                className="w-full h-full object-cover min-h-[30vh] transition-opacity duration-300 z-0"
            />

            <div className="absolute inset-0 flex flex-col items-start justify-center text-center px-4 sm:px-6 md:px-12 text-white">
                <div className="w-full max-w-2xl ml-0 lg:ml-32">
                    <h1
                        className="text-4xl text-left sm:text-5xl md:text-6xl font-bold mb-4"
                        style={{
                            fontSize: "clamp(32px, 6vw, 100px)",
                        }}
                    >
                        {data.heading}
                    </h1>
                    <p
                        className="text-base text-left sm:text-lg md:text-xl leading-relaxed mb-6"
                        style={{
                            fontSize: "clamp(14px, 3vw, 20px)",
                        }}
                    >
                        Protecting your digital world with proactive
                        threat detection, robust defenses, and
                        real-time security insights.
                    </p>
                    <Link to="/contact">
                        <button className="group flex items-center bg-white text-[#5D00F3] px-4 py-1 sm:px-6 sm:py-3 rounded-full shadow-md hover:bg-purple-50 transition duration-300 text-lg font-medium">
                            Contact Us
                            <BsArrowUpRight className="transition ease-in-out ml-2 text-[#5D00F3] font-semibold" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
