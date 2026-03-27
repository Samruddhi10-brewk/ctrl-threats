import {useState, useEffect} from "react";
import {IoMdRefresh, IoMdInformationCircleOutline} from "react-icons/io";
import {FaLongArrowAltRight} from "react-icons/fa";
import axios from "../../services/axios";
import {APIS} from "../../services/api";

const parseTracerouteData = (rawData: string): string[] => {
    if (typeof rawData !== 'string') {
        throw new Error("Invalid data format");
    }

    if (rawData.toLowerCase().includes("error")) {
        throw new Error(rawData.trim());
    }

    // Split by newlines and filter out empty lines
    const lines = rawData.split("\n").filter((line) => line.trim() !== "");
    
    return lines;
};

const TraceRoute = ({domain}: {domain: string | undefined}) => {
    const [parsedData, setParsedData] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTracerouteData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/results${APIS.TRACEROUTE}`, {
                    params: { domain },
                });
                
                if (response.data?.error) {
                    throw new Error(response.data.error);
                }
                
                const tracerouteData = response.data?.traceroute;
                if (!tracerouteData) {
                    throw new Error("No data received");
                }
                
                const parsed = parseTracerouteData(tracerouteData);
                setParsedData(parsed);
            } catch (err: any) {
                let errorMessage = "An error occurred";
                if (err.response?.data?.error) {
                    errorMessage = err.response.data.error;
                } else if (err.response?.status) {
                    const status = err.response.status;
                    if (status === 500) errorMessage = "Server error";
                    else if (status === 503) errorMessage = "Backend unavailable";
                    else if (status === 504) errorMessage = "Request timed out";
                    else errorMessage = `API error ${status}`;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                setParsedData([]);
            } finally {
                setLoading(false);
            }
        };

        if (domain) {
            fetchTracerouteData();
        }
    }, [domain]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-lg bg-white p-6">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-[#5900EA] font-bold text-lg w-full">TRACE ROUTE</h2>
                    </header>
                    <div className="text-center text-red-500 bg-purple-50 font-semibold mb-4 h-13 p-4">
                        {error}
                    </div>
                </section>
            </div>
        );
    }

    if (parsedData.length === 0) {
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-lg bg-white p-6">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-[#5900EA] font-bold text-lg w-full">TRACE ROUTE</h2>
                    </header>
                    <div className="text-center text-gray-500 bg-purple-50 font-semibold mb-4 h-13 p-4">
                        No traceroute data available
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            <section className="rounded-lg shadow-lg bg-white p-6">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-[#5900EA] font-bold text-lg w-full">TRACE ROUTE</h2>
                    <section className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </section>
                </header>

                <div className="text-center text-black-500 bg-purple-50 font-semibold mb-4 h-13 p-4">
                    Trace Route Details
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {parsedData.map((line, index) => (
                        <div key={index} className="flex items-center rounded-lg">
                            <div className="text-left bg-purple-50 px-3 py-2 flex-1 text-sm font-mono">
                                <p className="text-gray-700">{line}</p>
                            </div>
                            {/* {index < parsedData.length - 1 && (
                                <FaLongArrowAltRight className="text-gray-400 text-lg mx-2" />
                            )} */}
                        </div>
                    ))}
                </div>

                <footer className="mt-6 flex justify-center text-center bg-purple-50 h-13 p-4">
                    <p className="text-gray-700 font-semibold">Traceroute completed ({parsedData.length} hops).</p>
                </footer>
            </section>
        </div>
    );
};

export default TraceRoute;
