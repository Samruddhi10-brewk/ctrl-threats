import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { HTTPHeaders } from "../../types/result";

const HeadersJoin = ({
    HeadersJoin,
}: {
    HeadersJoin: HTTPHeaders | undefined;
}) => {
    if (!HeadersJoin || !HeadersJoin.headers) {
        return null; // Gracefully handle cases where data is not available
    }

    const { headers } = HeadersJoin;

    return (
        <div className="py-4 px-2 sm:px-4 max-w-full mx-auto">
            <div className="rounded-lg shadow-md p-4 sm:p-6 bg-white">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#5900EA] font-bold text-lg">HEADERS</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </div>

                {/* Headers List */}
                <div className="space-y-4">
                    {Object.entries(headers).map(([key, value], index) => (
                        <div
                            key={index}
                            className="flex flex-wrap sm:flex-nowrap items-start border-b border-gray-200 pb-2"
                        >
                            {/* Header Key */}
                            <span className="text-gray-600 font-bold w-full sm:w-1/3 break-words">
                                {key}:
                            </span>

                            {/* Header Value */}
                            <span className="text-gray-500 text-sm w-full sm:w-2/3 break-words text-right sm:text-left">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeadersJoin;
