import { useState } from "react";
import {
    IoMdArrowDropright,
    IoMdRefresh,
    IoMdInformationCircleOutline,
    IoMdArrowDropdown,
    IoMdArrowDropup,
} from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import { CheckDNSSEC } from "../../types/result";

// Ensure CheckDNSSEC type is correctly defined
const DNSSecurity = ({ DNSSecurity }: { DNSSecurity: CheckDNSSEC | undefined }) => {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    // Toggle dropdown for sections
    const toggleDropdown = (section: string) => {
        setSelectedSection((prevSection) => (prevSection === section ? null : section));
    };

    // Render DNS data dynamically with error handling
    const renderDNSData = (data: Record<string, any> | undefined, label: string) => {
        // Return early if data is undefined or missing required properties
        if (!data || !data.hasOwnProperty("Present")) {
            return (
                <div className="p-3 rounded-lg mb-0">
                    <div className="flex justify-between items-center bg-purple-50 p-2">
                        <div>
                            <span className="font-semibold text-gray-700">{label}</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                            <FaTimes className="text-red-500 text-lg" />
                            <span className="font-semibold">Data unavailable</span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-3 rounded-lg mb-0">
                <div
                    className="flex justify-between items-center bg-purple-50 p-2"
                    onClick={() => toggleDropdown(label)}
                >
                    <div>
                        <span className="font-semibold">{label}</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer">
                        {data["Present"] === "Present" ? (
                            <FaCheck className="text-green-500 text-lg" />
                        ) : (
                            <FaTimes className="text-red-500 text-lg" />
                        )}
                        <span className="font-medium">
                            {data["Present"] === "Present" ? "YES" : "NO"}
                        </span>
                        {selectedSection === label ? (
                            <IoMdArrowDropup className="text-gray-500 text-xl" />
                        ) : (
                            <IoMdArrowDropdown className="text-gray-500 text-xl" />
                        )}
                    </div>
                </div>

                {selectedSection === label && (
                    <ul className="mt-4 space-y-2">
                        {Object.keys(data).map((key) => {
                            if (key !== "Present") {
                                return (
                                    <li
                                        key={key}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                                    >
                                        <span className="text-gray-600">{key}</span>
                                        <div className="flex items-center">
                                            {data[key] ? (
                                                <FaCheck className="text-green-500 text-lg" />
                                            ) : (
                                                <FaTimes className="text-red-500 text-lg" />
                                            )}
                                        </div>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                )}
            </div>
        );
    };

    return (
        DNSSecurity && (
            <div className="max-w-full w-full bg-white rounded-lg shadow-md p-5">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-[#5900EA] uppercase">
                        DNS Security Info
                    </h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                {/* Render each DNS section */}
                {renderDNSData(DNSSecurity.DNSKEY, "DNSKEY")}
                {renderDNSData(DNSSecurity.DS, "DS")}
                {renderDNSData(DNSSecurity.RRSIG, "RRSIG")}
            </div>
        )
    );
};

export default DNSSecurity;
