import { aboutData } from "../../../../constants/aboutpage";

export default function About() {
    return (
        <div>
            {aboutData.map((data, index) => (
                <div
                    key={index}
                    className="relative w-full mx-auto min-h-[30vh] h-full xl:h-[80vh] my-0"
                >
                    <img
                        src={data.image}
                        alt="about"
                        className="w-full h-full object-cover min-h-[60vh] transition-opacity duration-300 z-0"
                        
                    >
                    </img>

                    {/* Centered Text */}
                    <div className="absolute top-[15%] md:top-1/3 z-10 w-3/4 text-start px-6 md:px-12 lg:px-32">
                        <div className="text-white">
                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                {data.heading}
                            </h1>
                            <p className="text-lg lg:text-xl leading-relaxed">
                                {data.details}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
