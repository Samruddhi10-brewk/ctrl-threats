import {IoMdRefresh, IoMdInformationCircleOutline} from "react-icons/io";
import {Carbon as CarbonData} from "../../types/result";

const Carbon = ({carbonData}: {carbonData: CarbonData | undefined}) => {
    if (!carbonData) {
        return <div className="p-5 max-w-xl mx-auto">Loading or no data available...</div>;
    }

    return (
        <div className="bg-white shadow-lg rounded-sm p-3 w-full h-fit">
            <section className="flex items-center w-full justify-between">
                <h1 className="text-[#5900EA] font-[600] text-[24px]">Carbon Footprint</h1>
                <section className="flex items-center gap-2">
                    <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                    <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                </section>
            </section>

            <section className="flex flex-col gap-4">
                <div className="bg-purple-50 p-4 rounded-lg w-full">
                    <h4 className="text-gray-600 mb-2 text-lg font-semibold">Statistics:</h4>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600 font-semibold">Adjusted Bytes:</span>
                        <span className="font-medium text-gray-500">
                            {carbonData.statistics?.adjustedBytes?.toLocaleString() || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-semibold">Energy:</span>
                        <span className="font-medium text-gray-500">
                            {carbonData.statistics?.energy?.toExponential(2) || "N/A"}
                        </span>
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg w-full">
                    <h4 className="text-gray-600 mb-2 text-lg font-semibold">CO₂:</h4>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600 font-semibold">Grid CO₂ (Grams):</span>
                        <span className="font-medium text-gray-500">
                            {carbonData.statistics?.co2?.grid?.grams?.toFixed(5) || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-semibold">Grid CO₂ (Litres):</span>
                        <span className="font-medium text-gray-500">
                            {carbonData.statistics?.co2?.grid?.litres?.toFixed(5) || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-gray-600 font-semibold">Renewable CO₂ (Grams):</span>
                        <span className="font-medium text-gray-500">
                            {carbonData.statistics?.co2?.renewable?.grams?.toFixed(5) || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-semibold">Renewable CO₂ (Litres):</span>
                        <span className="font-medium text-gray-500">
                            {carbonData.statistics?.co2?.renewable?.litres?.toFixed(5) || "N/A"}
                        </span>
                    </div>
                </div>
            </section>

            <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                    <span className="text-gray-600 text-lg font-semibold">Cleaner Than:</span>
                    <span className="font-medium text-gray-500">{carbonData.cleanerThan ?? "N/A"}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 py-2">
                    <span className="text-gray-600 font-semibold">Rating:</span>
                    <span className="font-medium text-gray-500">{carbonData.rating ?? "N/A"}</span>
                </div>
                {/* <div className="flex justify-between items-center border-b border-gray-200 py-2">
                    <span className="text-gray-600 font-semibold">Green:</span>
                    <span
                        className={`font-medium ${carbonData.green ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {carbonData.green ? "True" : "False"}
                    </span>
                </div> */}
                <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-semibold">Scan URL:</span>
                    <a
                        href={carbonData.scanUrl ?? "#"}
                        className="font-medium text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {carbonData.scanUrl ?? "N/A"}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Carbon;
