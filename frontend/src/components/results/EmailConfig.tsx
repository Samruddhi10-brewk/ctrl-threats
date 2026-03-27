import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { CheckEmailConfiguration } from "../../types/result";

const EmailConfig = ({ emailData }: { emailData: CheckEmailConfiguration | undefined }) => {
    const boldRecords = [
        "aspmx.l.google.com.",
        "alt3.aspmx.l.google.com.",
        "alt1.aspmx.l.google.com.",
        "alt2.aspmx.l.google.com.",
        "alt4.aspmx.l.google.com.",
    ];

    if (!emailData) {
        return <div className="p-5 max-w-xl mx-auto">Loading or no data available...</div>;
    }

    return (
        <div className="w-full mx-auto space-y-8">
            {/* Email Configuration Section */}
            <section className="rounded-lg border border-gray-100 shadow-md p-6">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#5900EA] pr-4">EMAIL CONFIGURATION</h2>
                    <section className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </section>
                </header>

                <section className="space-y-4 bg-purple-50 pb-1 mb-4 pr-4 pl-4 pt-4 pb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">SPF</span>
                        <div className="flex items-center">
                            <span className="text-red-500 font-bold mr-2 flex justify-between items-center">✘</span>
                            <span className="text-gray-500 text-xs">NO</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                        <span className="text-sm font-semibold text-gray-700">DKIM</span>
                        <div className="flex items-center">
                            <span className="text-green-600 font-bold mr-2">✔</span>
                            <span className="text-green-600 text-xs">Safe</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                        <span className="text-sm font-semibold text-gray-700">DMARC</span>
                        <div className="flex items-center">
                            <span className="text-red-500 font-bold mr-2">✘</span>
                            <span className="text-gray-500 text-xs">NO</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                        <span className="text-sm font-semibold text-gray-700">BIMI</span>
                        <div className="flex items-center">
                            <span className="text-red-500 font-bold mr-2">✘</span>
                            <span className="text-gray-500 text-xs">NO</span>
                        </div>
                    </div>
                </section>
            </section>

            {/* MX Records Section */}
            <section className="rounded-lg border border-gray-100 shadow-md p-6">
                <header className="mb-4">
                    <h3 className="text-lg text-[#5900EA] font-semibold">MX RECORDS</h3>
                </header>
                <section className="bg-purple-50 space-y-3 pr-4 pl-4 pt-4 pb-4">
                    {[
                        { record: "aspmx.l.google.com.", priority: 1 },
                        { record: "alt3.aspmx.l.google.com.", priority: 10 },
                        { record: "alt1.aspmx.l.google.com.", priority: 5 },
                        { record: "alt2.aspmx.l.google.com.", priority: 5 },
                        { record: "alt4.aspmx.l.google.com.", priority: 10 },
                    ].map((mx, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center ${
                                index > 0 ? "border-t border-gray-200 pt-4" : ""
                            }`}
                        >
                            <span
                                className={`text-sm ${
                                    boldRecords.includes(mx.record) ? "font-semibold" : "text-gray-700"
                                }`}
                            >
                                {mx.record}
                            </span>
                            <span className="text-gray-500 text-sm">Priority: {mx.priority}</span>
                        </div>
                    ))}
                </section>
            </section>
        </div>
    );
};

export default EmailConfig;
