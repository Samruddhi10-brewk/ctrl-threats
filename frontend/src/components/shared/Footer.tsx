import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-100 w-full pb-4">
            {/* Company Logos on Top */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 text-center">
                <p className="text-black font-medium text-2xl sm:text-3xl md:text-4xl pt-4">
                    Our <span className="text-[#6100FF]">Partners</span>
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 mt-6">
                    <img src="/NVIDIA logo.svg" alt="NVIDIA" className="w-28 sm:w-32 md:w-40 h-auto" />
                    <img src="/startup-india-logo.png" alt="Startup India" className="w-28 sm:w-32 md:w-40 h-auto" />
                    <img src="/make-in-india-logo.png" alt="Make in India" className="w-28 sm:w-32 md:w-40 h-auto" />
                    <img src="/microsoft-logo-png.webp" alt="Microsoft Startups" className="w-28 sm:w-32 md:w-40 h-auto" />
                    <img src="/india-ai-logo.png" alt="India AI" className="w-28 sm:w-32 md:w-40 h-auto" />
                </div>
            </div>

            <div className="container mx-auto px-2 sm:px-6 lg:px-6 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    
                    {/* Logo & Social Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                        <img src="/ctrlthreatfooterlogo.png" alt="Ctrl Threats Logo" className="w-40 sm:w-48 md:w-52 lg:w-56 h-auto mb-6" />
                        <p className="text-xl">Follow us:</p>
                        <div className="flex space-x-6">
                            <Link to="https://www.facebook.com/profile.php?id=61567012508755" target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={36} className="hover:text-purple-600 transition" />
                            </Link>
                            <Link to="https://www.instagram.com/cybrisk.tech/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={36} className="hover:text-purple-600 transition" />
                            </Link>
                            <Link to="https://x.com/CYBRISKTECH" target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={36} className="hover:text-purple-600 transition" />
                            </Link>
                            <Link to="https://www.linkedin.com/showcase/ctrl-threats/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={36} className="hover:text-purple-600 transition" />
                            </Link>
                            <Link to="#" target="_blank" rel="noopener noreferrer">
                                <FaYoutube size={36} className="hover:text-purple-600 transition" />
                            </Link>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="text-center md:text-left space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Company</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-purple-600 transition text-lg">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 hover:text-purple-600 transition text-lg">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div className="text-center md:text-left space-y-4">
                        <h2 className="text-lg font-bold text-gray-800">Services</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/webscan" className="text-gray-600 hover:text-purple-600 transition text-lg">Web Scan</Link>
                            </li>
                            <li>
                                <Link to="/emaildetection" className="text-gray-600 hover:text-purple-600 transition text-lg">Phishing Email</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-end items-end mt-10 text-gray-600 text-sm sm:text-base">
                    <div className="flex flex-wrap justify-center md:justify-start space-x-6">
                        <Link to="/terms-of-use" className="hover:text-purple-600 transition">Terms of Service</Link>
                        <Link to="/privacy-policy" className="hover:text-purple-600 transition">Privacy Policy</Link>
                    </div>
                    <p className="mt-4 md:mt-0 text-center md:text-right pl-8">
                        &copy; {new Date().getFullYear()} F9 Cybrisk Tech Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
