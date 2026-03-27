import {IoMdRefresh, IoMdInformationCircleOutline} from "react-icons/io";
import {RedirectChain} from "../../types/result";
import {JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState} from "react";

const Redirects = ({redirectsData}: {redirectsData: RedirectChain | undefined}) => {
    const [error, setError] = useState<string | null>(null);

    // Validate and handle missing or malformed redirectsData
    if (!redirectsData) {
        setError("Redirect data is not available.");
        return (
            <div className="w-full mx-auto">
                <section className="rounded-lg shadow-md p-5 bg-white">
                    <p className="text-center text-red-600 font-bold">{error}</p>
                </section>
            </div>
        );
    }
    console.log(redirectsData.redirect_chain)


    return (
        <div className="w-full mx-auto">
            <section className="rounded-lg shadow-md p-5 bg-white">
                <header className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-[#5900EA]">REDIRECTS</h2>
                    <div className="flex items-center gap-2">
                        <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                        <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                    </div>
                </header>

                <h3 className="text-sm font-bold text-gray-700 rounded-md ">
                    Redirect Chain for <span className="font-bold">{redirectsData.domain}</span>
                </h3>

                {
                    redirectsData && redirectsData.redirect_chain && redirectsData.redirect_chain.map((ok: { [x: string]: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                            <span className="text-sm font-bold text-gray-600">{Object.keys(ok)[0]} {ok[Object.keys(ok)[0]]}</span>
                            <span className="text-sm text-blue-600 ">
                                {Object.keys(ok)[1]} {ok[Object.keys(ok)[1]]}
                            </span>
                        </div>
                    ))
                }
                <div className="border-t border-gray-200 pt-2"></div>
            </section>
        </div>
    );
};

export default Redirects;
