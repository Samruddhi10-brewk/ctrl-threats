import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { CheckFirewallEndpoint } from "../../types/result";

const FirewallDetection = ({ FirewallDetection }: { FirewallDetection: CheckFirewallEndpoint | undefined }) => {
  if (!FirewallDetection) return null;

  // Placeholder property names, adjust as per actual structure
  const firewallEnabled = FirewallDetection.firewallEnabled; // Update to the correct property
  const wafType = FirewallDetection.wafType; // Update to the correct property

  return (
    <div className="p-6 border rounded-md shadow-md w-full mx-auto mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#5900EA] font-bold text-lg py-2">FIREWALL DETECTION</h2>
        <div className="flex space-x-1">
          <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
          <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
        </div>
      </div>
      <div className="bg-purple-50">
        {/* Firewall Enabled Status */}
        <div className="flex justify-between items-center mb-1 p-1 py-1">
          <span className="text-gray-700 font-bold py-2">Firewall</span>
          <div className="flex items-center px-2 py-1">
            <span className="text-green-500 font-bold text-lg">✔</span>
            <p className="ml-1 text-gray-500 gap-2">{firewallEnabled ? "YES" : "NO"}</p>
          </div>
        </div>

        <div className="border-t">
          {/* WAF Vendor */}
          <div className="flex justify-between items-center mb-1 p-1 py-2">
            <span className="text-gray-700 font-bold gap-2">WAF Type</span>
            <span className="text-gray-500">{wafType || "Unknown"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirewallDetection;
