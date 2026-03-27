import React, { useState, useEffect } from "react";
import {
    IoMdRefresh,
    IoMdInformationCircleOutline,
    IoMdArrowDropdown,
    IoMdArrowDropright,
} from "react-icons/io";
import { TlsData } from "../../types/tlstype";

const TLSHandshake = ({ tlsData }: { tlsData: TlsData }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [handshakeData, setHandShakeData] = useState<
        {
            name: string;
            version: string;
            platform: string;
            curve_code: string;
            is_supported: boolean;
            protocol_code: string;
        }[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // Check if this is fallback data (is_fallback flag)
            const isFallback = (tlsData as any)?.is_fallback === true;
            
            if (!tlsData) {
                throw new Error("No TLS data available.");
            }

            // Handle fallback data from direct SSL connection
            if (isFallback || !Array.isArray(tlsData.analysis)) {
                // For fallback data, we don't have detailed client support info
                setError("Limited TLS information available - Full handshake details unavailable in fallback mode.");
                setHandShakeData([]);
                return;
            }

            const tlsClientSupportData =
                tlsData.analysis.find((a) => a.analyzer === "sslLabsClientSupport")?.result || [];

            if (!Array.isArray(tlsClientSupportData) || tlsClientSupportData.length === 0) {
                setError("No TLS client support data available.");
                setHandShakeData([]);
                return;
            }

            const parsedData = tlsClientSupportData.map((item: any) => ({
                name: item.name || "Unknown",
                version: item.version || "N/A",
                platform: item.platform || "N/A",
                curve_code: item.curve_code || "N/A",
                is_supported: !!item.is_supported,
                protocol_code: item.protocol_code || "N/A",
            }));

            setHandShakeData(parsedData);
            setError(null);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while processing the handshake data.");
            setHandShakeData([]);
        }
    }, [tlsData]);

    const toggleDetails = (index: number) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    if (error) {
        return (
            <div className="w-full mx-auto px-6 sm:px-8">
                <section className="rounded-lg shadow-md p-8 bg-white border">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-[#5900EA]">TLS HANDSHAKE</h2>
                    </header>
                    <div className="text-center text-red-500 font-semibold">{error}</div>
                </section>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto px-2 sm:px-0">
            <section className="rounded-lg shadow-md p-6 bg-white">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-[#5900EA]">TLS HANDSHAKE</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                <div className="space-y-4">
                    {handshakeData && handshakeData.length > 0 ? (
                        handshakeData.map((handshake, index) => (
                            <div key={index} className="space-y-2">
                                <button
                                    onClick={() => toggleDetails(index)}
                                    className="w-full flex justify-between items-center p-2 bg-purple-50 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-2 items-center w-full">
                                        <span className="text-sm font-semibold text-gray-600 flex-1 break-words text-left">
                                            Name: {handshake.name}
                                        </span>
                                        <span className="text-sm text-gray-500 flex-1 break-words">
                                            Version: {handshake.version}
                                        </span>
                                    </div>
                                    {expandedIndex === index ? (
                                        <IoMdArrowDropdown className="text-gray-500" />
                                    ) : (
                                        <IoMdArrowDropright className="text-gray-500" />
                                    )}
                                </button>

                                {expandedIndex === index && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600 w-full sm:w-auto break-words">
                                                Platform:
                                            </span>
                                            <span className="text-sm text-gray-700 w-full sm:w-auto break-words">
                                                {handshake.platform}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600 w-full sm:w-auto break-words">
                                                Curve Code:
                                            </span>
                                            <span className="text-sm text-gray-700 w-full sm:w-auto break-words">
                                                {handshake.curve_code}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600 w-full sm:w-auto break-words">
                                                Supported:
                                            </span>
                                            <span className="text-sm text-gray-700 w-full sm:w-auto break-words">
                                                {handshake.is_supported ? "Yes" : "No"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-600 w-full sm:w-auto break-words">
                                                Protocol Code:
                                            </span>
                                            <span className="text-sm text-gray-700 w-full sm:w-auto break-words">
                                                {handshake.protocol_code}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-600">No TLS client support data available.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default TLSHandshake;
