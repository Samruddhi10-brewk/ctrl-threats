import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { SSLCurve } from "../../types/result";

const Curves = ({ curveData }: { curveData: SSLCurve | undefined }) => {
    return (
        curveData && (
            <div className="bg-white shadow-md rounded-lg p-6 h-fit w-full mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#5900EA]">CURVES</h2>
                    <div className="flex space-y-2">
                        <section className="flex items-center gap-2">
                            <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                            <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                        </section>
                    </div>
                </div>
                <div className="space-y-2">
                    {/* Check if curveData is present */}
                    <div className="flex justify-between border-b">
                        <span className="text-gray-700 font-semibold">{curveData.ASN1_Curve}</span>
                        <span className="text-gray-600 text-m">{curveData.domain}</span>
                    </div>
                    <div className="flex justify-between border-b">
                        <span className="text-gray-700 font-semibold">{curveData.NIST_Curve}</span>
                        <span className="text-gray-600 text-m">Google Trust Service..</span>
                    </div>
                </div>
            </div>
        )
    );
}

export default Curves;
