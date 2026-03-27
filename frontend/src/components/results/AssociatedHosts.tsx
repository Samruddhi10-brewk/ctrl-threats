import { IoMdInformationCircleOutline, IoMdRefresh } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { AssociatedDomains } from "../../types/result";

const AssociatedHosts = ({ associatedHosts }: { associatedHosts: AssociatedDomains | undefined }) => {
    if (!associatedHosts) {
        return <div className="p-5 max-w-xl mx-auto">Loading or no data available...</div>;
    }

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md relative h-fit">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#5900EA]">ASSOCIATED HOSTS</h2>
                <div className="flex items-center gap-2">
                    <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                    <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                </div>
            </header>

            <p className="text-bold text-gray-600">
                <span className="font-bold">Associated Domains for</span>{" "}
                <span className="font-bold">{associatedHosts?.domain}</span>:
            </p>
            <hr className="border-t border-gray-300 mt-1 mb-4" />

            <div className="max-h-64 overflow-y-auto pr-2 overflow-x-clip">
                <ul className="space-y-2">
                    {associatedHosts?.associated_domains?.length > 0 ? (
                        associatedHosts?.associated_domains.map((domain, index) => (
                            <li
                                key={index}
                                className="flex items-center text-gray-700 text-sm border-b border-gray-200 pb-2"
                            >
                                <FaLongArrowAltRight className="text-black mr-2 text-l" />
                                {domain}
                            </li>
                        ))
                    ) : (
                        <p className="text-sm text-gray-600">No associated domains available.</p>
                    )}
                </ul>
            </div>

            <style>
                {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #8A2BE2;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: #6c1db9;
          }
          ::-webkit-scrollbar-track {
            background-color: #f1f1f1;
          }
        `}
            </style>
        </div>
    );
};

export default AssociatedHosts;
