import {IoMdRefresh, IoMdInformationCircleOutline} from "react-icons/io";
import {ServerInfo as ServerInfoType} from "../../types/result";

type ServerInfoKey = keyof ServerInfoType;

const ServerInfo = ({serverInfo}: {serverInfo: ServerInfoType | undefined}) => {
    // Function to safely extract serverInfo properties
    const safeGet = (key: ServerInfoKey) => {
        if (serverInfo)
            return serverInfo[key] ? serverInfo[key] : "Data not available";
    };

    return (
        serverInfo && (
            <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#5900EA]">SERVER INFO</h2>
                    <section className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-xl text-gray-500 cursor-pointer" />
                    </section>
                </header>

                <div className="space-y-4">
                    {[
                        {label: "IP Address", value: safeGet("IP")},
                        {label: "Content Type", value: safeGet("Content Type")},
                        {label: "ASN Code", value: safeGet("ASN Code")},
                        {label: "ISP", value: safeGet("ISP")},
                        {label: "Network Range", value: safeGet("Network Range")},
                        {label: "Server Type", value: safeGet("Server Type")},
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-b border-gray-200 pb-2"
                        >
                            <span className="text-sm font-bold text-gray-700">{item?.label}:</span>
                            <span className="text-sm text-gray-800">{item?.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default ServerInfo;
