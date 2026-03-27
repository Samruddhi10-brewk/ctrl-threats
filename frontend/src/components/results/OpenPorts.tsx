import { IoMdRefresh, IoMdInformationCircleOutline } from 'react-icons/io';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { ScanPortsAPI } from '../../types/result';
import { useState } from 'react';

const OpenPorts = ({ OpenPorts }: { OpenPorts: ScanPortsAPI | undefined }) => {
  const [error, setError] = useState<string | null>(null);

  // Define a range of common ports to calculate closed ports.
  const allPossiblePorts = Array.from({ length: 10 }, (_, i) => i + 1); // Example: 1-10 for demonstration

  if (!OpenPorts) {
    setError("Port scan data is not available.");
    return (
      <div className="w-full mx-auto">
        <section className="rounded-lg shadow-md p-6 bg-white">
          <p className="text-center text-red-600 font-bold">{error}</p>
        </section>
      </div>
    );
  }

  if (!Array.isArray(OpenPorts.open_ports)) {
    setError("Invalid port data format.");
    return (
      <div className="w-full mx-auto">
        <section className="rounded-lg shadow-md p-6 bg-white">
          <p className="text-center text-red-600 font-bold">{error}</p>
        </section>
      </div>
    );
  }

  // Calculate closed ports
  const closedPorts = allPossiblePorts.filter(
    (port) => !OpenPorts.open_ports.includes(port)
  );

  return (
    <div className="w-full mx-auto">
      <section className="rounded-lg shadow-md p-6 bg-white">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#5900EA]">OPEN PORTS</h2>
          <div className="flex items-center gap-2">
            <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
            <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
          </div>
        </header>

        {/* List Open Ports */}
        <div className="space-y-2">
          {OpenPorts.open_ports.length > 0 ? (
            OpenPorts.open_ports.map((port, index) => (
              <div
                key={index}
                className="border-b border-gray-300 py-2 flex items-center"
              >
                <FaLongArrowAltRight className="text-black mr-2 text-lg" />
                <span className="text-sm text-gray-800">Port {port} is open.</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No open ports found.</p>
          )}
        </div>

        {/* Closed Ports Section */}
        {
            // <div className="mt-4">
            // <h3 className="text-gray-700 font-bold mb-2">
            // Closed ports on {OpenPorts.domain || "the domain"}:
            //     </h3>
            // <p className="text-gray-800 text-sm">
            // [{closedPorts.length > 0 ? closedPorts.join(', ') : "None"}]
            // </p>
            // </div>
        }
      </section>
    </div>
  );
};

export default OpenPorts;
