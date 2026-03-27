import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdInformationCircleOutline, IoMdRefresh } from "react-icons/io";

// Types for cookies
interface Cookie {
  Value: string;
  Domain: string;
  Path: string;
  Secure: boolean;
  HttpOnly: boolean;
}

interface Cookies {
  cookies: Record<string, Cookie>;
}

interface CookieDetailsProps {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
}

const CookieDetails: React.FC<CookieDetailsProps> = ({ name, value, domain, path, secure, httpOnly }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex justify-between items-center bg-purple-50 p-2">
        <span className="text-sm font-semibold text-gray-700">Cookie Name:</span>
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1">
          <span className="text-sm text-gray-800">{name}</span>
          {isOpen ? (
            <IoMdArrowDropup className="text-xl text-gray-500" />
          ) : (
            <IoMdArrowDropdown className="text-xl text-gray-500" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2 mt-2">
          <div className="flex justify-between items-center bg-purple-50 p-2">
            <span className="text-sm text-gray-600">Value:</span>
            <span className="text-sm text-gray-800 truncate">{value}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 p-2">
            <span className="text-sm text-gray-600">Domain:</span>
            <span className="text-sm text-gray-800">{domain}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 p-2">
            <span className="text-sm text-gray-600">Path:</span>
            <span className="text-sm text-gray-800">{path}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 p-2">
            <span className="text-sm text-gray-600">Secure:</span>
            <span className="text-sm text-gray-800">{secure ? "True" : "False"}</span>
          </div>
          <div className="flex justify-between items-center bg-purple-50 p-2">
            <span className="text-sm text-gray-600">HttpOnly:</span>
            <span className="text-sm text-gray-800">{httpOnly ? "True" : "False"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const CookieInfo = ({ CookieInfo }: { CookieInfo: Cookies | undefined }) => {
  return (
    CookieInfo && (
      <div className="py-8 max-w-full w-full">
        <section className="rounded-lg shadow-md p-6 bg-white">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#5900EA]">COOKIES</h2>
            <div className="flex items-center gap-2">
              <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
              <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
            </div>
          </header>

          {/* Safely access cookies */}
          {CookieInfo.cookies &&
            Object.entries(CookieInfo.cookies).map(([name, cookie]) => (
              <CookieDetails
                key={name}
                name={name}
                value={cookie.Value}
                domain={cookie.Domain}
                path={cookie.Path}
                secure={cookie.Secure}
                httpOnly={cookie.HttpOnly}
              />
            ))}
        </section>
      </div>
    )
  );
};

export default CookieInfo;
