import { useState, useEffect } from "react";
import {
    IoMdRefresh,
    IoMdInformationCircleOutline,
    IoMdArrowDropdown,
    IoMdArrowDropright,
} from "react-icons/io";
import { ConnectionInfo } from "../../types/tlstype";

const CipherSuite = ({ name, onClick, isOpen }: { name: string; onClick: () => void; isOpen: boolean }) => (
    <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-2 bg-purple-50 border border-gray-200 mt-2"
    >
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-700">Cipher:</span>
            <span className="text-sm text-gray-700">{name}</span>
        </div>
        {isOpen ? (
            <IoMdArrowDropdown className="text-black-800" />
        ) : (
            <IoMdArrowDropright className="text-black-800" />
        )}
    </button>
);

const CipherSuiteDetails = ({
    protocols,
    pubkey,
    sigalg,
    pfs,
    curves,
    code,
    ticket_hint,
    ocsp_stapling,
}: {
    protocols: string[];
    pubkey: number;
    sigalg: string;
    pfs: string;
    curves: string;
    code: number;
    ticket_hint: string;
    ocsp_stapling: boolean;
}) => (
    <div className="mt-4 space-y-3">
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Code:</span>
            <span className="text-sm text-gray-800">{code || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Protocols:</span>
            <span className="text-sm text-gray-800">{protocols.length > 0 ? protocols.join(", ") : "N/A"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Public Key Size:</span>
            <span className="text-sm text-gray-800">{pubkey || "N/A"} bits</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Signature Algorithm:</span>
            <span className="text-sm text-gray-800">{sigalg || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Perfect Forward Secrecy (PFS):</span>
            <span className="text-sm text-gray-800">{pfs || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Curves:</span>
            <span className="text-sm text-gray-800">{curves || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">Ticket Hint:</span>
            <span className="text-sm text-gray-800">{ticket_hint || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-100 p-2 border-gray-200">
            <span className="text-sm text-gray-600">OCSP Stapling:</span>
            <span className="text-sm text-gray-800">{ocsp_stapling ? "Enabled" : "Disabled"}</span>
        </div>
    </div>
);

const TLSCipherSuites = ({ ciphersuite }: { ciphersuite: ConnectionInfo["ciphersuite"] | string | undefined }) => {
    const [expandedCipher, setExpandedCipher] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ciphersuite) {
            setError("No cipher suite data available.");
        } else {
            setError(null);
        }
    }, [ciphersuite]);

    const handleCipherClick = (cipher: string) => {
        setExpandedCipher(expandedCipher === cipher ? null : cipher);
    };

    if (error) {
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-md p-6 bg-white border">
                    <header className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[#5900EA]">TLS CIPHER SUITES</h2>
                    </header>
                    <p className="text-center text-gray-500 font-semibold">{error}</p>
                </section>
            </div>
        );
    }

    // Handle string ciphersuite (from fallback)
    if (typeof ciphersuite === 'string') {
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-md p-6 bg-white">
                    <header className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[#5900EA]">TLS CIPHER SUITE</h2>
                    </header>
                    <div className="bg-purple-50 p-4 rounded">
                        <p className="text-sm text-gray-700"><span className="font-semibold">Current Cipher:</span> {ciphersuite}</p>
                    </div>
                </section>
            </div>
        );
    }

    if (!ciphersuite || !Array.isArray(ciphersuite) || ciphersuite.length === 0) {
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-md p-6 bg-white border">
                    <header className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[#5900EA]">TLS CIPHER SUITES</h2>
                    </header>
                    <p className="text-center text-gray-500">No cipher suite data available.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            <section className="rounded-lg shadow-md p-6 bg-white">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#5900EA]">TLS CIPHER SUITES</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                {ciphersuite.map((cipherSuite) => (
                    <div key={cipherSuite.code}>
                        <CipherSuite
                            name={cipherSuite.cipher}
                            onClick={() => handleCipherClick(cipherSuite.cipher)}
                            isOpen={expandedCipher === cipherSuite.cipher}
                        />
                        {expandedCipher === cipherSuite.cipher && (
                            <CipherSuiteDetails
                                protocols={cipherSuite.protocols || []}
                                pubkey={cipherSuite.pubkey || 0}
                                sigalg={cipherSuite.sigalg || "Unknown"}
                                pfs={cipherSuite.pfs || "Unknown"}
                                curves={cipherSuite.curves || "Unknown"}
                                code={cipherSuite.code || 0}
                                ticket_hint={cipherSuite.ticket_hint || "Unknown"}
                                ocsp_stapling={cipherSuite.ocsp_stapling || false}
                            />
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default TLSCipherSuites;
