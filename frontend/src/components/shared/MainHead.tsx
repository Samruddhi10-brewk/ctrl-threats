import { FiMail } from "react-icons/fi";
import { MdOutlineLocalPhone } from "react-icons/md";

export default function MainHeader() {
    return (
        <div
            style={{
                background: "linear-gradient(90deg, #5D00F4 0%, #4D00CD 100%)",
            }}
            className="text-white px-4 sm:px-8 py-2 flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-10 text-center"
        >
            <div className="flex items-center space-x-2">
                <FiMail className="text-lg font-bold" />
                <span className="text-xs sm:text-sm">info@cybrisktech.com</span>
            </div>

            <div className="flex items-center space-x-2">
                <MdOutlineLocalPhone className="text-lg" />
                <span className="text-xs sm:text-sm">+91 9611111665</span>
            </div>
        </div>
    );
};
