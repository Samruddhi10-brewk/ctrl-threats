import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { CheckHSTS } from "../../types/result";

const HTTPStrict = ({ HTTPStrict }: { HTTPStrict: CheckHSTS | undefined }) => {
    if (!HTTPStrict) {
        return null; // Return nothing if no data is available
    }

    // Prepare HSTS details for display
    const hstsDetails = [
        {
            label: "HSTS Enabled?",
            value: HTTPStrict.hstsEnabled ? "Yes" : "No",
            status: HTTPStrict.hstsEnabled, // Boolean for displaying the check icon
        },
        {
            label: "max-age",
            value: HTTPStrict.maxAge || "Not specified", // Default message for missing data
        },
        {
            label: "includeSubDomains",
            value: HTTPStrict.includeSubDomains ? "true" : "false",
        },
        {
            label: "preload",
            value: HTTPStrict.preload ? "true" : "false",
        },
    ];

    // Prepare the compatibility message
    const compatibilityMessage = HTTPStrict.compatibility
        ? HTTPStrict.compatibility.preloadReady
            ? "Site is compatible with the HSTS preload list!"
            : HTTPStrict.compatibility.notes || "No additional notes available."
        : "Compatibility details not available.";

    return (
        <div className="w-full mx-auto">
            <section className="rounded-lg shadow-lg p-6 bg-white">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#5900EA]">
                        HTTP STRICT TRANSPORT SECURITY
                    </h2>
                    <div className="flex items-center gap-3">
                        <IoMdInformationCircleOutline className="text-gray-500 text-2xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-2xl cursor-pointer" />
                    </div>
                </header>

                <div className="bg-purple-50 p-2 rounded-lg">
                    <ul className="space-y-1 divide-y divide-gray-300">
                        {hstsDetails.map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center py-2"
                            >
                                <span className="font-semibold">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    {item.status !== undefined && item.status && (
                                        <FaCheck className="text-green-500 text-lg" />
                                    )}
                                    <span className="text-gray-500">{item.value}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4">
                        <span className="text-sm text-gray-500">{compatibilityMessage}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HTTPStrict;
