import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { CheckURL } from "../../types/result";

const BlockDetection = ({ BlockDetection }: { BlockDetection: CheckURL | undefined }) => {
    if (!BlockDetection) {
        return <div className="p-5 max-w-xl mx-auto">Loading or no data available...</div>;
    }

    return (
        <div className="max-w-full w-full">
            <section className="rounded-lg shadow-md p-6 bg-white">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-[#5900EA]">BLOCK DETECTION</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                <section className="bg-purple-50 rounded-md p-3 space-y-2">
                    {Object.entries(BlockDetection).map(([service, status], index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center ${index > 0 ? "border-t border-gray-200 pt-2" : ""}`}
                        >
                            <span className="text-sm font-semibold">{service}</span>
                            <div className="flex items-center ml-6">
                                <span
                                    className={`${status.includes("✅") ? "text-green-500" : "text-red-500"
                                        } font-bold mr-3 text-lg`}
                                ></span>
                                <span className="text-gray-500 text-sm">{status}</span>
                            </div>
                        </div>
                    ))}
                </section>
            </section>
        </div>
    );
};

export default BlockDetection;
