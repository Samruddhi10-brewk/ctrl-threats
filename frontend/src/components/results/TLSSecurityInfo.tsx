import { useEffect, useState } from "react";
import { IoMdRefresh, IoMdInformationCircleOutline, IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import { TlsData } from "../../types/tlstype";

const StatusItem = ({ label, status }: { label: string; status: boolean }) => (
  <div className="flex justify-between items-center bg-gray-100 p-2 border border-gray-200 rounded-md">
    <span className="text-sm font-semibold text-gray-600">{label}:</span>
    <span className="text-sm flex items-center gap-2">
      {status ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
      <span className="text-gray-700">{status ? "Yes" : "Null"}</span>
    </span>
  </div>
);

const TLSecurityInfo = ({ tlsSecutiyData }: { tlsSecutiyData: TlsData["analysis"] | undefined | string | any[] }) => {
  const [selectedAnalyzerIndex, setSelectedAnalyzerIndex] = useState<number | null>(null);
  const [showDetailsIndex, setShowDetailsIndex] = useState<number | null>(null);
  const [processedAnalysisData, setProcessedAnalysisData] = useState<
    { name: string; success: boolean; result: Record<string, any> }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!tlsSecutiyData) {
        throw new Error("No TLS security data available.");
      }

      // If data is a string (from fallback), show it as a simple status
      if (typeof tlsSecutiyData === 'string') {
        setProcessedAnalysisData(null);
        setError(null);
        return;
      }

      // If it's not an array, check if it has an analyzer property
      if (!Array.isArray(tlsSecutiyData)) {
        // Try to convert it to array format
        if (typeof tlsSecutiyData === 'object' && tlsSecutiyData.analyzer) {
          tlsSecutiyData = [tlsSecutiyData];
        } else {
          throw new Error("Invalid TLS security data format.");
        }
      }

      const analyzersData = tlsSecutiyData.map((analyzer) => {
        if (!analyzer || typeof analyzer !== "object") {
          return {
            name: "Unknown",
            success: false,
            result: {},
          };
        }

        return {
          name: analyzer.analyzer || "Unknown",
          success: analyzer.success ?? false,
          result: analyzer.result || {},
        };
      });

      setProcessedAnalysisData(analyzersData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setProcessedAnalysisData(null);
    }
  }, [tlsSecutiyData]);

  const toggleAnalyzer = (index: number) => {
    setSelectedAnalyzerIndex((prevIndex) => (prevIndex === index ? null : index));
    setShowDetailsIndex(null); // Close details when a different analyzer is selected
  };

  const toggleDetails = (index: number) => {
    setShowDetailsIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (error) {
    return (
      <div className="py-8 max-w-full w-full">
        <section className="rounded-lg shadow-md p-6 bg-white">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#5900EA]">TLS SECURITY INFO</h2>
          </header>
          <div className="text-center text-gray-500 font-semibold">{error}</div>
        </section>
      </div>
    );
  }

  if (!processedAnalysisData) {
    return (
      <div className="py-8 max-w-full w-full">
        <section className="rounded-lg shadow-md p-6 bg-white">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#5900EA]">TLS SECURITY INFO</h2>
          </header>
          <div className="text-center text-gray-500">Limited TLS analysis available</div>
        </section>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-full w-full">
      <section className="rounded-lg shadow-md p-6 bg-white">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#5900EA]">TLS SECURITY INFO</h2>
          <div className="flex items-center gap-2">
            <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
            <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
          </div>
        </header>

        <div className="space-y-3">
          <div className="flex justify-between items-center bg-purple-50 p-2 border border-gray-200">
            <span className="text-sm font-semibold text-gray-600">Certificate Analysis:</span>
          </div>

          {processedAnalysisData.map((analyzer, index) => (
            <div key={index} className="space-y-3">
              <button
                onClick={() => toggleAnalyzer(index)}
                className="w-full flex justify-between items-center p-2 bg-purple-50 border border-gray-200"
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-gray-600">Analyzer:</span>
                  <span className="text-sm text-gray-500">{analyzer.name}</span>
                </div>
                {selectedAnalyzerIndex === index ? (
                  <IoMdArrowDropdown className="text-gray-500" />
                ) : (
                  <IoMdArrowDropright className="text-gray-500" />
                )}
              </button>

                {selectedAnalyzerIndex === index && (
                  <div className=" pb-1 border-gray-200 ">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 pb-2 pt-1">Success:</span>
                      <div className="flex items-center">
                        {analyzer.success ? (
                          <>
                            <FaCheck className="text-green-500 mr-1" />
                            <span className="text-sm text-gray-700">Yes</span>
                          </>
                        ) : (
                          <>
                            <FaTimes className="text-red-500 mr-1" />
                            <span className="text-sm text-gray-700">Null</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDetails(index)}
                      className="w-full flex justify-between items-center p-2 bg-gray-200 border-gray-300 "
                    >
                      <span className="text-sm font-semibold text-gray-600">Details:</span>
                      {showDetailsIndex === index ? (
                        <IoMdArrowDropdown className="text-gray-500" />
                      ) : (
                        <IoMdArrowDropright className="text-gray-500" />
                      )}
                    </button>

                    {showDetailsIndex === index && (
                      <div className="space-y-3 mt-2 border-gray-200">
                        {Object.keys(analyzer.result).map((key) => {
                          const resultValue = analyzer.result[key];
                          if (Array.isArray(resultValue)) {
                            return (
                              <StatusItem key={key} label={key} status={resultValue.length > 0} />
                            );
                          } else if (typeof resultValue === "boolean") {
                            return (
                              <StatusItem key={key} label={key} status={resultValue} />
                            );
                          } else {
                            return (
                              <StatusItem key={key} label={key} status={resultValue !== "None" && resultValue !== ""} />
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
};

export default TLSecurityInfo;
