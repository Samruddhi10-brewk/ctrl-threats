import React, {useState, useEffect} from 'react';
import {IoMdRefresh, IoMdInformationCircleOutline} from "react-icons/io";
import axios from '../../services/axios';
import {APIS} from '../../services/api';
import {DNSData} from '../../types/check_dnstype';

interface DnsServerCardProps {
    serverNumber: number;
    ipAddress: string;
    dohSupport: string;
}

const DnsServerCard: React.FC<DnsServerCardProps> = ({serverNumber, ipAddress, dohSupport}) => {
    return (
        <div className="bg-purple-50 p-4 rounded-lg mb-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                DNS Server #{serverNumber}
            </h4>
            <div className="flex justify-between items-center border-b border-gray-300 py-1">
                <span className="text-sm font-bold text-gray-600">IP Address</span>
                <span className="text-sm text-gray-800">{ipAddress || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 py-1.5">
                <span className="text-sm font-bold text-gray-600">DoH Support</span>
                <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-800">{dohSupport}</span>
                </div>
            </div>
        </div>
    );
};

const DnsServerInfo = ({domain}: {domain: string | undefined}) => {
    const [result, setResult] = useState<DNSData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDNSServerInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                let decodedDomain;
                if (domain) decodedDomain = decodeURIComponent(domain);
                const data = await axios.get(`/results${APIS.CHECK_DNS}`, {
                    params: {
                        domain: decodedDomain
                    }
                });

                if (data.data.result.error) {
                    throw new Error(data.data.result.error);
                }

                setResult(data.data.result);
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
                setResult([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDNSServerInfo();
    }, [domain]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-md p-6 bg-white">
                    <header className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-purple-700">DNS SERVER</h2>
                    </header>
                    <div className="text-center text-red-500 font-semibold mb-4">
                        {error}
                    </div>
                </section>
            </div>
        );
    }

    const isDNSServer = (item: any): item is {"DNS Server": string; "IP Address": string; "DoH Support": string} =>
        "DNS Server" in item && "IP Address" in item && "DoH Support" in item;

    const dnsServers = Array.isArray(result) ? result.filter(isDNSServer) : [];
    const note = Array.isArray(result) ? result.find((item: any) => "note" in item)?.note : null;

    return (
        <div className="w-full mx-auto">
            <section className="rounded-lg shadow-md p-6 bg-white">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#5900EA]">DNS SERVER</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                {dnsServers.map((server, index) => (
                    <DnsServerCard
                        key={index}
                        serverNumber={index + 1}
                        ipAddress={server ? server["IP Address"] : 'N/A'}
                        dohSupport={server ? server["DoH Support"] : 'N/A'}
                    />
                ))}

                {note && (
                    <p className="text-xs text-gray-500 mt-4">
                        {note}
                    </p>
                )}
            </section>
        </div>
    );
};

export default DnsServerInfo;
