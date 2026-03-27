// Updated Code
import React, { useState, useEffect } from "react";
import { IoMdRefresh, IoMdInformationCircleOutline, IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { data } from "../../services/fetchResult";

// Define types for the DNS records
interface DnsRecord {
  [key: string]: string[] | string | null;
}

const CrawlRules = () => {
  const [dnsRecords, setDnsRecords] = useState<DnsRecord | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCrawlRules = async () => {
      try {
        const { dns_record } = await data; // Adjust data fetching as needed
        setDnsRecords(dns_record?.dns_records || null);
      } catch (err) {
        console.error("Error fetching crawl rules data:", err);
      }
    };

    fetchCrawlRules();
  }, []);

  const toggleDetails = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (!dnsRecords) {
    return <div className="p-5 max-w-xl mx-auto">Loading crawl rules data...</div>;
  }

  const dnsRecordKeys = Object.keys(dnsRecords);

  return (
    <div className="p-5 mx-auto max-w-full w-full">
      <div className="rounded-lg shadow-md p-5 bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#5900EA] font-bold text-lg">CRAWL RULES</h2>
          <div className="flex items-center gap-2">
            <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
            <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
          </div>
        </div>

        {/* Render DNS record sections */}
        {dnsRecordKeys.map((key, index) => (
          <div key={index} className="mb-2 border">
            {/* Collapsible header */}
            <button
              onClick={() => toggleDetails(index)}
              className="w-full flex justify-between items-center p-2 bg-purple-50"
            >
              <span className="text-sm font-semibold text-gray-600">{key.toUpperCase()}</span>
              {expandedIndex === index ? (
                <IoMdArrowDropdown className="text-gray-500" />
              ) : (
                <IoMdArrowDropright className="text-gray-500" />
              )}
            </button>

            {/* Details section */}
            {expandedIndex === index && (
              <div
                className="bg-gray-100 p-3 w-full"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {Array.isArray(dnsRecords[key]) ? (
                  dnsRecords[key].length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {dnsRecords[key].map((record: string, idx: number) => {
                        const [beforeEq, afterEq] = record.split("=", 2);
                        return (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 break-words"
                          >
                            <span className="font-bold text-gray-900">{beforeEq} </span>
                            <span className="text-gray-600"> {afterEq}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700">No records found</p>
                  )
                ) : (
                  <p className="text-sm text-gray-700 break-words">{dnsRecords[key]}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrawlRules;
