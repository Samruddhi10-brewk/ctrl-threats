import { useEffect, useState } from "react"
import AssociatedHosts from "./components/results/AssociatedHosts"
import axios from "./services/axios"
import { useParams, useNavigate } from "react-router-dom";
import ServerLocation from "./components/results/Serverlocation"
import ServerInfo from "./components/results/ServerInfo"
import Curves from "./components/results/Curves"
import ServerStatus from "./components/results/ServerStatus"
import Redirects from "./components/results/Redirects"
import Carbon from "./components/results/CarbonFP"
import EmailConfig from "./components/results/EmailConfig"
import BlockDetection from "./components/results/BlockDetection"
import DnsServerInfo from "./components/results/DNSServerInfo"
import OpenPorts from "./components/results/OpenPorts"
import TraceRoute from "./components/results/TraceRoute"
import GlobalRank from "./components/results/GlobalRank"
import CookieInfo from "./components/results/Cookies"
import DomainInfo from "./components/results/WhoisDomain"
import CrawlRules from "./components/results/CrawlRules"
import HeadersJoin from "./components/results/Headers"
import SecurityTxt from "./components/results/Securitytxt"
import FirewallDetection from "./components/results/FirewallDetection"
import TLSCipherSuites from "./components/results/TLSCipherSuites"
import TLSHandshake from "./components/results/TLSHandshake"
import HTTPSecurity from "./components/results/HTTPSecurity"
import HTTPStrict from "./components/results/HTTPStrict"
import { DomainInfo as DomainType } from "./types/result"
import { Tabs } from "flowbite-react"
import MalwareDetection from "./components/results/MalwareDetection"
import TLSecurityInfo from "./components/results/TLSSecurityInfo"
import Spinner from "./components/shared/Spinner"
import { TlsData } from "./types/tlstype"
import LinkedPages from "./components/results/LinkedPages"
import DNSSecurity from "./components/results/DNSSecurity"
import ProgressLine from "./components/ProgressLine"
import { RootState, useAppSelector } from "./store"

const tabTheme = {
    base: "",
    tablist: {
        base: "flex justify-around text-md",
        variant: {
            "underline": "-mb-px flex-wrap border-b border-[#dcdcdc]",
        },
        tabitem: {
            base: "w-1/3 flex items-center text-md md:text-lg capitalized justify-center h-[5rem] px-4 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400",
            variant: {
                "underline": {
                    "base": "rounded-t-lg",
                    "active": {
                        "on": `active rounded-t-lg border-b-2 border-[#5a00eb] text-[#5a00eb]`,
                        "off": "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                    }
                },
            },
            icon: "mr-2 h-5 w-5",
        },
    },
    tabitemcontainer: {
        base: "w-full",
        variant: {
            default: "",
        },
    },
    tabpanel: "py-3 h-full rounded-r-3xl p-6",
};

const Results = () => {
    const navigate = useNavigate();
    const store = useAppSelector((store: RootState) => store.currentUser);
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [tlsLoading, setTlsLoading] = useState(true);
    const [webScanData, setWebScanData] = useState<DomainType | null>(null);
    const [tlsData, setTLSData] = useState<TlsData | null>(null);
    const [decodedDomain] = useState(decodeURIComponent(params?.domain as string));
    const [favicon, setFavicon] = useState<string | null>(null);
    const [ipAddress, setIpAddress] = useState<string | null>(null);
    const [scanTime, setScanTime] = useState<number>(0);
    const [startTime] = useState<number>(Date.now());

    // Calculate job statistics based on actual webscan data
    const getJobStats = () => {
        if (!webScanData) {
            return {
                totalJobs: 0,
                successfulJobs: 0,
                skippedJobs: 0,
                failedJobs: 0,
            };
        }

        let successful = 0;
        let failed = 0;
        let skipped = 0;

        // Check each result in webScanData to count successful/failed jobs
        Object.entries(webScanData).forEach(([key, value]) => {
            if (key === 'domain') return;
            
            if (value === null || value === undefined) {
                skipped++;
            } else if (typeof value === 'object' && 'error' in value) {
                failed++;
            } else {
                successful++;
            }
        });

        const total = successful + failed + skipped;
        return {
            totalJobs: total,
            successfulJobs: successful,
            skippedJobs: skipped,
            failedJobs: failed,
        };
    };

    const { totalJobs, successfulJobs, skippedJobs, failedJobs } = getJobStats();

    const progressParts = [
        { 
            label: "Successful", 
            percentage: totalJobs > 0 ? Math.round((successfulJobs / totalJobs) * 100) : 0, 
            color: "mediumseagreen",
            count: successfulJobs 
        },
        { 
            label: "Skipped", 
            percentage: totalJobs > 0 ? Math.round((skippedJobs / totalJobs) * 100) : 0, 
            color: "gold",
            count: skippedJobs 
        },
        { 
            label: "Failed", 
            percentage: totalJobs > 0 ? Math.round((failedJobs / totalJobs) * 100) : 0, 
            color: "tomato",
            count: failedJobs 
        },
    ];
    
    const jobCounts = progressParts;

    useEffect(() => {
        // Auth check
        if (!store) {
            localStorage.setItem("redirectUrl", `/result/${params.domain}`);
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            const fetchFavicon = async () => {
                try {
                    const response = await axios.get(`/results/fetch_favicon?domain=${decodedDomain}`);
                    if (response.data.favicon) {
                        setFavicon(response.data.favicon);
                    }
                } catch (error: any) {
                    console.error("Error fetching favicon:", error.response ? error.response.data : error.message);
                }
            };

            const fetchWebscan = async () => {
                const webScanStartTime = Date.now();
                try {
                    const data = await axios.get(`/results/webscan?domain=${decodedDomain}`);
                    setWebScanData(data.data);
                    const elapsed = Date.now() - webScanStartTime;
                    setScanTime(elapsed);
                } catch (error) {
                    console.error("Error fetching web scan data:", error);
                } finally {
                    setLoading(false);
                }
            };

            const fetchTLSData = async () => {
                try {
                    setTlsLoading(true);
                    const data = await axios.get("/results/check-tls", {
                        params: { domain: decodedDomain },
                        timeout: 120000 // 120 second timeout
                    });
                    
                    // Check if response contains an error
                    if (data.data?.error) {
                        console.warn("TLS API returned error:", data.data.error);
                        setTLSData(null);
                    } else if (data.data?.TLS) {
                        setTLSData(data.data.TLS);
                    } else {
                        console.warn("No TLS data in response");
                        setTLSData(null);
                    }
                } catch (error: any) {
                    console.error("Error fetching TLS data:", error.message);
                    if (error.response?.data?.error) {
                        console.error("API error:", error.response.data.error);
                    }
                    setTLSData(null);
                } finally {
                    setTlsLoading(false);
                }
            };

            const fetchIPAddress = async () => {
                try {
                    const response = await fetch(`https://dns.google/resolve?name=${decodedDomain}`);
                    const data = await response.json();
                    const ip = data.Answer?.find((record: { type: number }) => record.type === 1)?.data;
                    setIpAddress(ip || "No IP found");
                } catch (error: any) {
                    setIpAddress(`Error: ${error.message}`);
                }
            };

            fetchFavicon();
            fetchWebscan();
            fetchTLSData();
            fetchIPAddress();
        };

        fetchData();
    }, [store, decodedDomain, navigate, params.domain]);

    // Early return if not authenticated
    if (!store) {
        return null;
    }

    return (
        <div>
            <div className="flex flex-col w-auto max-w-[100rem] mx-auto">
                {/* Progress & Domain Info Section */}
                <section className="flex flex-col lg:flex-row max-w-[100rem] mx-auto w-full gap-3 text-white">
                    {/* Progress Bar Side */}
                    <span className="bg-[#5200D6] lg:w-4/5 w-full p-2">
                        <ProgressLine
                            label=""
                            visualParts={progressParts.map((part) => ({
                                percentage: `${part.percentage}%`,
                                color: part.color,
                            }))}
                        />
                        <div className="flex mt-4 text-sm text-white">
                            {jobCounts.map((part, index) => (
                                <div className="flex items-center pr-3" key={index}>
                                    <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: part.color }}></span>
                                    <span>{`${part.count} Jobs ${part.label}`}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-white text-right mt-10">Finished in {scanTime || 0} ms</div>
                    </span>
    
                    {/* Domain Info Side */}
                    <span className="bg-[#5200D6] lg:w-1/5 w-full flex justify-center p-4 flex-col text-center text-left">
                        <span className="text-lg font-bold text-left">Scan Site</span>
                        <span className="flex items-center gap-2 mt-2">
                            {favicon ? (
                                <img src={favicon} alt="Favicon" className="w-8 h-7 rounded-full" />
                            ) : (
                                <span>Loading favicon...</span>
                            )}
                            <span>{decodedDomain}</span>
                        </span>
                        <span className="mt-9 text-sm text-left">
                            {ipAddress ? `IP Address: ${ipAddress}` : "Fetching IP..."}
                        </span>
                    </span>
                </section>
    
                {/* Tabs Section */}
                <Tabs variant="underline" className="w-full" theme={tabTheme}>
                    {/* Network Tab */}
                    <Tabs.Item title="Network and Server Information">
                        {!loading ? (
                            <div>
                                <section className="w-full grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                    <span className="w-full flex flex-col items-center gap-10">
                                        <ServerLocation serverLocation={webScanData?.server_location} />
                                        <AssociatedHosts associatedHosts={webScanData?.associated_domains} />
                                        <ServerInfo serverInfo={webScanData?.server_info} />
                                    </span>
                                    <span className="w-full flex flex-col items-center gap-10">
                                        <Curves curveData={webScanData?.ssl_curve} />
                                        <ServerStatus serverStatus={webScanData?.check_server_status} />
                                        <Carbon carbonData={webScanData?.carbon} />
                                    </span>
                                    <span className="w-full flex flex-col items-center gap-10">
                                        <EmailConfig emailData={webScanData?.check_email_configuration} />
                                        <BlockDetection BlockDetection={webScanData?.check_url} />
                                    </span>
                                </section>
                            </div>
                        ) : (
                            <p className="flex h-full w-full justify-center items-center">
                                <Spinner />
                            </p>
                        )}
                    </Tabs.Item>
    
                    {/* Security Tab */}
                    <Tabs.Item title="Security and Protocols">
                        <div>
                            <section className="w-full grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                <span className="w-full flex flex-col items-center gap-10">
                                    <TraceRoute domain={params?.domain} />
                                    {!loading && (
                                        <>
                                            <OpenPorts OpenPorts={webScanData?.scan_ports_api} />
                                            <LinkedPages LinkedPages={webScanData?.get_links} />
                                        </>
                                    )}
                                </span>
                                {!loading ? (
                                    <span className="w-full flex flex-col items-center gap-10">
                                        <CookieInfo CookieInfo={webScanData?.cookies} />
                                        {webScanData?.redirect_chain && (
                                            <Redirects redirectsData={webScanData?.redirect_chain} />
                                        )}
                                        <HTTPStrict HTTPStrict={webScanData?.check_hsts} />
                                        <GlobalRank rankData={webScanData?.get_rank} />
                                        <MalwareDetection MalwareDetection={webScanData?.check_threat} />
                                        <DNSSecurity DNSSecurity={webScanData?.check_dnssec} />
                                    </span>
                                ) : (
                                    <p className="flex h-full w-full justify-center items-center">
                                        <Spinner />
                                    </p>
                                )}
                                <span className="w-full flex flex-col items-center gap-10">
                                    <DnsServerInfo domain={params?.domain} />
                                    {!loading ? (
                                        <>
                                            <SecurityTxt SecurityTxt={webScanData?.check_security} />
                                            <HeadersJoin HeadersJoin={webScanData?.http_headers} />
                                        </>
                                    ) : (
                                        <p className="flex h-full w-full justify-center items-center">
                                            <Spinner />
                                        </p>
                                    )}
                                </span>
                            </section>
                        </div>
                    </Tabs.Item>
    
                    {/* Domain Tab */}
                    <Tabs.Item title="Domain and DNS">
                        <div>
                            <section className="w-full grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                <span className="w-full flex flex-col items-center gap-10">
                                    <DomainInfo domain={params?.domain} />
                                    <CrawlRules />
                                </span>
                                <span className="w-full flex flex-col items-center gap-10">
                                    {!tlsLoading ? (
                                        <>
                                            {tlsData ? (
                                                <>
                                                    <TLSCipherSuites ciphersuite={tlsData?.connection_info?.ciphersuite} />
                                                    <TLSecurityInfo tlsSecutiyData={tlsData?.analysis} />
                                                </>
                                            ) : (
                                                <div className="w-full rounded-lg shadow-lg bg-white p-6 text-center">
                                                    <p className="text-gray-600">TLS data unavailable</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="flex h-full w-full justify-center items-center">
                                            <Spinner />
                                        </p>
                                    )}
                                </span>
                                <span className="w-full flex flex-col items-center gap-10">
                                    <FirewallDetection FirewallDetection={webScanData?.check_firewall_endpoint} />
                                    <HTTPSecurity httpSecurityData={webScanData?.check_http_security} />
                                    {tlsData && <TLSHandshake tlsData={tlsData} />}
                                </span>
                            </section>
                        </div>
                    </Tabs.Item>
                </Tabs>
            </div>
        </div>
    );
}


export default Results;
