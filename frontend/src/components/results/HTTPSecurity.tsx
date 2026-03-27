import {IoMdRefresh, IoMdInformationCircleOutline} from "react-icons/io";
import {FaCheck, FaTimes} from "react-icons/fa";
import {CheckHTTPHeaderSecurity} from "../../types/result";

const HTTPSecurity = ({
    httpSecurityData,
}: {
    httpSecurityData: CheckHTTPHeaderSecurity | undefined;
}) => {
    if (!httpSecurityData) {
        return null; // Return nothing if no data is available
    }

    const {security_headers} = httpSecurityData;

    return (
        <div className="w-full mx-auto">
            <section className="rounded-lg shadow-md p-6 bg-white">
                {/* Header */}
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-[#5900EA] uppercase">
                        HTTP Security
                    </h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                {/* Security Policies List */}
                <ul className="space-y-2 bg-purple-50 divide-y divide-gray-300">
                    {security_headers && Object.entries(security_headers).map(([policy, isEnabled], index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center py-2 px-4"
                        >
                            <span className="text-gray-700 font-medium">{policy}</span>
                            <div className="flex items-center gap-2">
                                {isEnabled ? (
                                    <FaCheck className="text-green-500 text-lg" />
                                ) : (
                                    <FaTimes className="text-red-500 text-lg" />
                                )}
                                <span className="text-gray-600">
                                    {isEnabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default HTTPSecurity;
