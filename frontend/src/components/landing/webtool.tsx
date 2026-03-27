import { useState, useEffect } from "react";
import { webData } from "../../constants/webscantool";
import { useNavigate } from "react-router-dom";
import { accentColorText, accentGradientColor } from "../../constants/constants";
import { RootState, useAppSelector } from "../../store";
import { RiArrowDownDoubleFill } from "react-icons/ri";

export default function Webtool() {
    const navigate = useNavigate();
    const store = useAppSelector((store: RootState) => store.currentUser);
    const [domainName, setDomainName] = useState("");

    useEffect(() => {
        const storedDomainName = localStorage.getItem("domainName");
        if (storedDomainName) {
            setDomainName(storedDomainName);
        }
        localStorage.removeItem("domainName");
    }, []);

    // Helper function to validate domain names
    const isValidDomain = (domain: string) => {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)?[a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if the user is logged in
        if (!store) {
            localStorage.setItem("redirectUrl", "/webscan");
            localStorage.setItem("domainName", domainName); // Store the domainName
            navigate("/login");
            return;
        }

        // Ensure the domain name is not empty
        if (domainName.trim().length === 0) {
            return;
        }

        try {
            // Normalize and sanitize the domain name
            let sanitizedDomainName = domainName.trim();

            // Add "http://" if the protocol is missing
            if (!sanitizedDomainName.startsWith("http")) {
                sanitizedDomainName = "http://" + sanitizedDomainName;
            }

            // Create a URL object to parse the domain
            const url = new URL(sanitizedDomainName);
            let finalDomainName = url.hostname; // Extract the hostname (removes protocol and path)

            // Remove "www." if present
            if (finalDomainName.startsWith("www.")) {
                finalDomainName = finalDomainName.substring(4);
            }

            // Validate the domain name
            if (!isValidDomain(finalDomainName)) {
                console.error("Invalid domain name entered");
                return;
            }

            // Navigate to the sanitized domain result page
            navigate(`/result/${finalDomainName}`);
        } catch (error) {
            console.error("Invalid domain name entered:", error);
        }
    };

    return (
        webData.map((data, index) => (
            <div
                key={index}
                className={`flex flex-col min-h-[80vh] px-4 py-16 md:px-16 lg:py-28 ${accentGradientColor}`}
            >
                <section className='flex flex-col max-w-[120rem] md:flex-row items-center justify-between  mx-auto'>
                    <div className="max-w-xl text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            {data.heading}
                        </h1>
                        <p className="text-sm text-gray-300 mb-5">{data.subheading}</p>
                        <span className='flex items-center gap-10 mb-5'>
                            <h2 className="text-2xl font-semibold text-white">{data.header}</h2>
                            <RiArrowDownDoubleFill className='text-white text-xl animate-bounce' />
                        </span>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <input
                                type="text"
                                placeholder="Enter a URL to start"
                                className="w-full md:w-auto px-5 py-4 text-black focus:outline-none"
                                onChange={(e) => {
                                    setDomainName(e.target.value);
                                    localStorage.setItem("domainName", e.target.value);
                                }}
                                value={domainName}
                            />
                            <button
                                type="submit"
                                className={`bg-white ${accentColorText} font-semibold px-8 py-3 hover:bg-purple-100 transition`}
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    <div className="relative mt-10 md:mt-0 md:ml-40">
                        <img
                            src={data.img}
                            alt="Network Insights"
                            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl object-contain"
                        />
                        <img
                            src={data.render}
                            alt="Chart Render"
                            className="absolute top-20 left-[-40px] md:top-32 md:left-[-60px] 
                                   w-48 md:w-80 lg:w-80 rounded-lg hidden md:block"
                        />
                    </div>

                </section>
            </div>
        ))
    );
};