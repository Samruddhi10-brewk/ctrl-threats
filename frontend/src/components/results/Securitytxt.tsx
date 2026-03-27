import React, { useState } from "react";
import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { CheckSecurity } from "../../types/result";

const SecurityTxt = ({ SecurityTxt }: { SecurityTxt: CheckSecurity | undefined }) => {
  const [error, setError] = useState<string | null>(null);

  // Validate and handle missing or malformed SecurityTxt data
  if (!SecurityTxt) {
    setError("Security.txt data is not available.");
    return (
      <div className="border-gray-300 p-6 rounded-md shadow-md w-full max-w-full mt-8 bg-white">
        <p className="text-center text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  // Safe check for 'result' property in SecurityTxt
  const isPresent = SecurityTxt.result?.toLowerCase().includes("present");

  return (
    <div className="border-gray-300 p-6 rounded-md shadow-md w-full max-w-full mt-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[#5900EA] font-bold text-lg">SECURITY.TXT</h2>
        <div className="flex space-x-2">
          <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
          <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
        </div>
      </div>

      {/* Presence Indicator */}
      <div className="flex items-center justify-between mt-4 bg-purple-50 rounded-md p-2">
        <p className="text-gray-700 font-semibold">Present</p>
        <div className="flex items-center">
          <span
            className={`font-bold text-lg ${isPresent ? "text-green-500" : "text-red-500"}`}
          >
            {isPresent ? "✔" : "✘"}
          </span>
          <p className="ml-1 text-gray-500">{isPresent ? "YES" : "NO"}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Having a security.txt ensures security researchers know how and where to safely report vulnerabilities.
        </p>
        <hr className="border-t mt-4" />
      </div>
    </div>
  );
};

export default SecurityTxt;
