import React from 'react';
import {casesData} from '../../constants/realcases';

export default function CyberThreatCases() {
    return (
        <div className="max-w-9xl mx-auto px-2 py-14">
            <h2 className="text-center text-2xl font-bold mb-12 text-gray-900 ">
                Real Cases of Cyber Threats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {casesData.map((caseItem, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition duration-300 py-10 px-8"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {caseItem.heading}
                        </h3>
                        <p className="text-gray-600">{caseItem.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
