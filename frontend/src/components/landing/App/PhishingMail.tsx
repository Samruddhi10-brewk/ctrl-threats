import { GoArrowUpRight } from "react-icons/go";
import axios from "../../../services/axios";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { RootState, useAppSelector } from "../../../store";
import { RiArrowDownDoubleFill } from "react-icons/ri";

export interface Result {
  processing_time: number
  result: Description
}

export interface Description {
  dkim_status: string
  dmarc_status: string
  is_phishing: boolean
  other_indicators: any[]
  spf_status: string
}


export default function PhishingMail() {
  const [emailSourceData, setEmailSourceData] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const store = useAppSelector((store: RootState) => store.currentUser);

  useEffect(() => {
    const storedEmailData = localStorage.getItem("emailSourceData");
    if (storedEmailData) {
      setEmailSourceData(storedEmailData);
    }
    localStorage.removeItem("emailSourceData");
  }, []);

  async function handleDetection(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!store) {
      localStorage.setItem("redirectUrl", "/emaildetection");
      localStorage.setItem("emailSourceData", emailSourceData);
      navigate("/login");
      return
    }
    if (emailSourceData.length == 0) {
      setError("Please enter email header text");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("header_text", emailSourceData)
      const res = await axios.post<Result>("/results/email_validate", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });
      setResult(res.data)
      setError(null);
    } catch (e: any) {
      console.error(e);
      const errorMessage = e.response?.data?.error || e.message || "Failed to analyze email";
      setError(errorMessage);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="h-full flex flex-col items-center text-center px-6 sm:px-8">
      <form className="mt-10 w-full max-w-5xl rounded-lg p-8 " onSubmit={(e) => { handleDetection(e) }}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 mb-6">
          Phishing Email Detection
        </h1>
        <div className="flex items-center justify-center text-gray-500 text-lg mb-6">
          <p>Paste Your Email Header Here</p>
          <RiArrowDownDoubleFill className="text-black text-xl animate-bounce ml-2" />
        </div>
        <div className="mt-16 w-full">
          <textarea onChange={(e) => {
            setEmailSourceData(e.target.value);
            localStorage.setItem("emailSourceData", e.target.value);
          }}
            value={emailSourceData}
            className="w-full h-40 border bg-white border-white-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-transparent p-4 resize-none"
            placeholder={`Delivered-To: user@example.com
From: sender@example.com
To: user@example.com
Subject: Sample Email
Date: Tue, 15 Feb 2025 10:00:00 -0500
Received: from mail.example.com (mail.example.com [192.0.2.1])
	by mail.example.com with ESMTPSA id QWERTY123
	for <user@example.com>; Tue, 15 Feb 2025 10:00:00 -0500`}
          ></textarea>
        </div>
        <div className="mt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-[rgba(97,0,255,1)] text-white font-semibold text-lg rounded-full shadow-md flex items-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze Email"}
            <GoArrowUpRight className="text-xl" />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 w-[45vw] max-w-2xl rounded-md bg-red-100 border border-red-400 p-6">
          <div className="text-red-800 font-semibold text-lg">Error</div>
          <div className="text-red-700 mt-2">{error}</div>
        </div>
      )}

      <div>
        {result && (
          <div className="w-[45vw] rounded-md" style={{ background: "#6100FF" }} >
            <div className="py-28 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Result Section */}
                <div
                  className={`text-2xl font-semibold text-center ${!result.result.is_phishing
                    ? "from-green-500 bg-gradient-to-r to-green-800"
                    : "bg-gradient-to-r from-red-500 to-red-800"
                    } text-white rounded-md py-2`}
                >
                  Result : {result.result.is_phishing ? "Phishing Email" : "Not Phishing"}
                </div>

                {/* Details Section */}
                <section className="text-md text-[#6100FF] font-medium mt-6">
                  <div className="flex justify-between border-b border-[#6100FF] py-2">
                    <span>Processing Time</span>
                    <span>{result.processing_time}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#6100FF] py-2">
                    <span>DKIM Status</span>
                    <span>{result.result.dkim_status}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#6100FF] py-2">
                    <span>DMARC Status</span>
                    <span>{result.result.dmarc_status}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#6100FF] py-2">
                    <span>SPF Status</span>
                    <span>{result.result.spf_status}</span>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>



      <div className="mt-10 w-full max-w-4xl text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-8">
          About Phishing Email Detection
        </h2>
        <p className="text-gray-600 text-base leading-relaxed mb-16">
          Phishing email detection is a process of identifying and blocking
          fraudulent emails designed to steal sensitive information, such as
          passwords, financial data, or personal details. Phishing emails often
          mimic legitimate organizations and use deceptive tactics to lure
          recipients into clicking malicious links or downloading harmful
          attachments.
        </p>
      </div>
    </div>
  );
};