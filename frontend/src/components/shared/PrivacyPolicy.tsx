import React from 'react'

const PrivacyPolicy = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="relative w-full h-[750px] flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/privacy-policy-ct.png')" }}
            >
                {/* Content */}
                <div className="relative z-10 px-8">
                    <h1 className="text-5xl font-bold">PRIVACY POLICY</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg">
                        At Ctrl Threats, your privacy is our priority. We are committed to protecting your personal
                        information and ensuring transparency about how we collect, use, and safeguard your data.
                    </p>
                </div>
            </div>
            <div className="flex flex-col min-h-screen bg-white">
                {/* Content Section */}
                <section className="max-w-6xl mx-auto py-14 px-2 text-gray-800">
                    <h1 className="text-2xl font-semibold mb-4">PRIVACY POLICY</h1>
                    <p className="mb-8">
                        At Ctrl Threats, safeguarding your privacy is at the core of our mission. This Privacy Policy explains the types of personal information we collect, how we use and protect it, and your rights regarding your data. This policy applies to all websites, applications, and services powered by Ctrl Threats, including but not limited to our Products: Ctrl Fake, DeepDetect, and ContentShield.<br /><br />
                        By using Ctrl Threats and its Products, you consent to the collection and use of your personal information as outlined in this policy.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Children's Privacy</h1>
                    <p className="mt-2">
                        Ctrl Threats prioritizes the protection of children's online privacy. In compliance with the Children's Online Privacy Protection Act (COPPA), our services are not designed for use by individuals under the age of 13. If you are under 13 years old, please refrain from using Ctrl Threats or its Products.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Information Collection <br /></h1>
                    <p className="mt-2">
                        Ctrl Threats may collect the following types of data: <br />
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                        <li>
                            <span className="font-semibold">Usage Data:</span> Information about how you interact with our website and Products, such as the number of scans performed and content verification history.
                        </li>
                        <li>
                            <span className="font-semibold">Account Data:</span> Information provided during account registration, including your name, email address, and payment details for premium services.
                        </li>
                        <li>
                            <span className="font-semibold">Uploaded Content:</span> Media files you submit for analysis. Please note, we process this data solely for content verification and do not store it beyond the completion of analysis.
                        </li>
                    </ul>

                    <h1 className="text-2xl font-semibold mt-6">Information Storage and GDPR Compliance <br /> </h1>
                    <p className="mt-2">
                        Ctrl Threats adheres to strict data storage practices and complies fully with the General Data Protection Regulation (GDPR). <br />
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                        <li>
                            <span className="font-semibold">Storage:</span> All data collected is stored securely in our systems.
                        </li>
                        <li>
                            <span className="font-semibold">EU Compliance:</span> No personal data of EU citizens is stored in our database unless explicitly authorized by the user.
                        </li>
                    </ul>

                    <h1 className="text-2xl font-semibold mt-6">Information Usage <br /> </h1>
                    <p className="mt-2">
                        The data we collect is used exclusively to: <br />
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                        <li>
                            Enhance and optimize our Products.
                        </li>
                        <li>
                            Provide personalized user experiences.
                        </li>
                        <li>
                            Conduct internal analytics for improving service quality. <br />
                        </li>
                    </ul>
                    <p className="mt-2">
                        We do not sell, share, or disclose your personal information to third parties unless required by law.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Cookies <br /> </h1>
                    <p className="mt-2">
                        Our website uses cookies to improve functionality and user experience. Cookies help us:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                        <li>
                            Remember your preferences.
                        </li>
                        <li>
                            Provide faster service during repeat visits.
                        </li>
                        <li>
                            Analyze website traffic for continuous improvement. <br />
                        </li>
                    </ul>
                    <p className="mt-2">
                        You may manage cookie settings through your browser.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Third-Party Services <br /> </h1>
                    <p className="mt-2">
                        Ctrl Threats integrates with third-party platforms (e.g., LinkedIn, Twitter, Facebook) to enhance functionality. Please note that these platforms have their own privacy policies, and Ctrl Threats is not responsible for their data collection practices.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Information Disclosure <br /> </h1>
                    <p className="mt-2">
                        We may disclose your information only in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                        <li>
                            To comply with legal requests, regulations, or legal processes.
                        </li>
                        <li>
                            To prevent fraud, security breaches, or unlawful activities.
                        </li>
                        <li>
                            To protect the rights, property, and safety of Ctrl Threats, its users, and the general public. <br />
                        </li>
                    </ul>

                    <h1 className="text-2xl font-semibold mt-6">Service Providers <br /> </h1>
                    <p className="mt-2">
                        To ensure a seamless user experience, Ctrl Threats uses trusted service providers for support and functionality. Any information shared with these providers is governed by their privacy policies.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Information Transfer <br /> </h1>
                    <p className="mt-2">
                        In the event of business expansions, acquisitions, or mergers, Ctrl Threats reserves the right to transfer collected data. We will notify users of any significant changes to data ownership or storage.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Your Rights<br /> </h1>
                    <p className="mt-4">
                        You have the right to:
                    </p>
                    <p className="mt-4">
                        Access, update, or delete your personal information.
                    </p>
                    <p className="mt-2">
                        Opt-out of certain data processing activities by contacting us.
                    </p>
                    <p className="mt-2">
                        For any privacy concerns or requests, please email
                        <a href="mailto:privacy@ctrlthreats.com" className="text-[#6100FF] hover:underline"> privacy@ctrlthreats.com</a>.
                    </p>

                    <h1 className="text-2xl font-semibold mt-6">Contact Us <br /> </h1>
                    <p className="mt-4">
                        For any questions about this policy or your personal data, contact us at: <br />
                        <a href="mailto:privacy@ctrlthreats.com" className="text-[#6100FF] hover:underline"> privacy@ctrlthreats.com</a>.
                    </p>
                    <p className="mt-4">
                        If you wish to report a breach of this policy, please let us know immediately at the same address.
                    </p>
                </section>
            </div>
        </>
    )
}

export default PrivacyPolicy