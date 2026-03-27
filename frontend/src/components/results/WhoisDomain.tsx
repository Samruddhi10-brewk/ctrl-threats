import { useState, useEffect } from "react";
import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";

// Import the data
import { data } from "../../services/fetchResult";

const WHOISDomainSimple = () => {
    const [whoisDates, setWhoisDates] = useState<{
        Registered: string | null;
        Updated: string | null;
        Expires: string | null;
    } | null>(null);

    useEffect(() => {
        const fetchWhoisData = () => {
            try {
                const { domain_info } = data;

                // Extract relevant dates from backend response
                const domainInformation = domain_info?.["Domain Information"] || {};
                const Registered = domainInformation["Registered On"] || null;
                const Updated = domainInformation["Updated On"] || null;
                const Expires = domainInformation["Expires On"] || null;

                // Update state with extracted data
                setWhoisDates({ Registered, Updated, Expires });
            } catch (error) {
                console.error("Error fetching WHOIS data:", error);
            }
        };

        fetchWhoisData();
    }, []);

    // Helper function to format date
    const formatDate = (isoDate: string | null): string => {
        if (!isoDate) return "N/A";

        try {
            const date = new Date(isoDate);
            return new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }).format(date);
        } catch {
            return "Invalid Date";
        }
    };

    if (!whoisDates) {
        return <div className="p-5 max-w-xl mx-auto">Loading WHOIS domain data...</div>;
    }

    return (
        <div className="p-5 mx-auto max-w-full w-full">
            <div className="rounded-lg shadow-md p-6 bg-white space-x-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#5900EA] font-bold text-lg">WHO IS DOMAIN</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </div>

                {/* Render Created, Updated, and Expiry dates */}
                <ul className="list-none space-y-3 text-sm text-gray-700 text-left">
                    <li>
                        <div className="flex justify-between items-center">
                            <strong className="text-gray-900 w-1/3 pr-6">Registered On:</strong>
                            <span className="w-1/3">{formatDate(whoisDates.Registered)}</span>
                        </div>
                        <hr className="mt-1 border-t border-gray-300" />
                    </li>
                    <li>
                        <div className="flex justify-between items-center">
                            <strong className="text-gray-900 w-1/3">Updated On:</strong>
                            <span className="w-1/3">{formatDate(whoisDates.Updated)}</span>
                        </div>
                        <hr className="mt-1 border-t border-gray-300" />
                    </li>
                    <li>
                        <div className="flex justify-between items-center">
                            <strong className="text-gray-900 w-1/3">Expires On:</strong>
                            <span className="w-1/3 pl-1">{formatDate(whoisDates.Expires)}</span>
                        </div>
                        <hr className="mt-1 border-t border-gray-300" />
                    </li>
                </ul>

            </div>
        </div>
    );
};

export default WHOISDomainSimple;
