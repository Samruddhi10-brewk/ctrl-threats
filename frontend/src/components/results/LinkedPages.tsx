import React, { useState } from "react";
import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { GetLinks } from "../../types/result";

const LinkedPages = ({
  LinkedPages,
}: {
  LinkedPages: GetLinks | undefined;
}) => {
  const [isInternalOpen, setInternalOpen] = useState(true);
  const [isExternalOpen, setExternalOpen] = useState(false);

  // Validate that LinkedPages contains valid data
  const hasInternalLinks =
    LinkedPages?.internal && Array.isArray(LinkedPages.internal);
  const hasExternalLinks =
    LinkedPages?.external && Array.isArray(LinkedPages.external);

  return (
    LinkedPages && (
      <div className="py-8 max-w-full w-full">
        <section className="rounded-lg shadow-md p-6 bg-white">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#5900EA]">LINKED PAGES</h2>
            <div className="flex items-center gap-2">
              <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
              <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
            </div>
          </header>

          {/* Internal Links */}
          <div className="mb-4">
            <button
              onClick={() => setInternalOpen(!isInternalOpen)}
              className="flex justify-between w-full text-left bg-purple-50 text-gray-700 font-semibold text-sm py-2 mb-3 pl-2"
            >
              <span>Internal:</span>
              {isInternalOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
            </button>
            {isInternalOpen && (
              <div className="space-y-2">
                {hasInternalLinks && LinkedPages.internal.length > 0 ? (
                  LinkedPages.internal.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-purple-50 p-2 rounded-lg"
                      style={{ overflow: "hidden" }}
                    >
                      <FaLongArrowAltRight className="mr-2 text-lg flex-shrink-0" />
                      <a
                        href={link}
                        className="text-sm hover:underline text-black break-all truncate max-w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No internal links available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* External Links */}
          <div className="">
            <button
              onClick={() => setExternalOpen(!isExternalOpen)}
              className="flex justify-between w-full text-left bg-purple-50 text-gray-700 font-semibold text-sm py-2 mb-3 pl-2"
            >
              <span>External:</span>
              {isExternalOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
            </button>
            {isExternalOpen && (
              <div className="space-y-2">
                {hasExternalLinks && LinkedPages.external.length > 0 ? (
                  LinkedPages.external.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-purple-50 p-2 rounded-lg"
                      style={{ overflow: "hidden" }}
                    >
                      <FaLongArrowAltRight className="mr-2 text-lg flex-shrink-0" />
                      <a
                        href={link}
                        className="text-sm hover:underline break-all truncate max-w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No external links available
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    )
  );
};

export default LinkedPages;
