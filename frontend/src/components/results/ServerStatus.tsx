import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { CheckServerStatus } from "../../types/result";

const ServerStatus = ({ serverStatus }: { serverStatus: CheckServerStatus | undefined }) => {
    // Function to extract the domain dynamically from the server message or default URL
    const extractDomain = (message: string | undefined): string => {
        try {
            if (!message) return "example.com"; // Default domain if no message
            const urlMatch = message.match(/https?:\/\/(www\.)?([\w.-]+)/); // Match URL or domain
            return urlMatch ? urlMatch[2] : "example.com"; // Extract domain or return default
        } catch {
            return "example.com"; // Fallback domain
        }
    };

    // Extracting status and status code safely
    const getStatus = (message: string | undefined): string =>
        message?.toLowerCase().includes("online") ? "Online" : "Offline";

    const getStatusCode = (message: string | undefined): string =>
        message?.split(":").pop()?.trim() || "N/A";

    // Derived values
    const domain = extractDomain(serverStatus?.message);
    const status = getStatus(serverStatus?.message);
    const statusCode = getStatusCode(serverStatus?.message);

    // Render Error Message if serverStatus is invalid
    if (!serverStatus) {
        return (
            <div className="w-full mx-auto h-fit">
                <section className="rounded-lg shadow-md p-5 bg-white">
                    <header className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold text-[#5900EA]">SERVER STATUS</h2>
                        <div className="flex items-center gap-2">
                            <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                            <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                        </div>
                    </header>
                    <p className="text-center text-red-500 font-semibold">
                        Server status information is unavailable.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto h-fit">
            <section className="rounded-lg shadow-md p-5 bg-white">
                <header className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-[#5900EA]">SERVER STATUS</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                {/* Dynamic Redirect Chain Heading */}
                <h3 className="text-sm font-bold text-gray-700 rounded-md">
                    Redirect Chain for <span className="font-bold">{domain}</span>
                </h3>

                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    <span className="text-sm font-bold text-gray-600">Server:</span>
                    {/* Checking if the message contains 'online' and updating the status accordingly */}
                    <span className={`text-m ${status === "Online" ? "text-green-500" : "text-red-500"}`}>
                        {status}
                    </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    <span className="text-sm font-bold text-gray-600">Status Code:</span>
                    <span className="text-gray-600 text-m">{statusCode}</span>
                </div>

                <div className="border-t border-gray-200 pt-2"></div>
            </section>
        </div>
    );
};

export default ServerStatus;
