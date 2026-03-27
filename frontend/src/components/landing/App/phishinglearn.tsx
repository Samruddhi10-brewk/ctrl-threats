import { learnData } from "../../../constants/learnphishing";
import { GoArrowUpRight } from "react-icons/go";

export default function Phishinglearn() {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 sm:px-8 md:px-14 lg:px-20 gap-y-16"
      style={{
        background: "linear-gradient(270deg, #4F05CA 0%, #5E05EF 90%)",
        minHeight: "70vh",
      }}
    >
      {learnData.map((item, index) => (
        <div
          key={index}
          className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 rounded-lg max-w-6xl w-full"
        >
          {/* Text Section */}
          <div className="p-6 lg:p-8 lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
              {item.heading}
            </h2>
            <p className="text-white text-sm md:text-base mb-4 lg:mb-6 leading-relaxed">
              {item.details}
            </p>
            <a
              href="/emaildetection"
              className="inline-flex items-center bg-white py-2 px-6 rounded-full text-lg font-medium transition text-[#5D00F3]"
            >
              Scan Now
              <GoArrowUpRight className="ml-2" />
            </a>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 w-full flex justify-center">
            <img
              src={item.image}
              alt="Phishing Email Detection"
              className="w-full max-w-md lg:max-w-full h-auto object-cover rounded-md shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
