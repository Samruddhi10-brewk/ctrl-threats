import {Link} from "react-router-dom";
import {learnData} from "../../../../constants/weblearn";
import {MdArrowOutward} from "react-icons/md";
export default function LearnMore() {
    const data = learnData[0];

    return (
        <div className="flex flex-col items-center p-10">
            <h2 className="font-medium text-center mb-4">Webscan: Complete Insight,<br /> Seamless Security</h2>
            <p className="text-gray-600 text-center mb-8 max-w-xl">
                {data.details}
            </p>
            <Link to="/webscan" className="bg-[#6100FF] text-white px-6 py-2 rounded-full shadow-md transition duration-200 flex items-center">
                Scan Now
                <MdArrowOutward className="w-5 h-5 text-white ml-1" />
            </Link>

            <div className="mt-14">
                <div className=" max-w-2xl mx-auto">
                    <img
                        src={data.img}
                        alt="Webscan Insight"
                        className="w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};
