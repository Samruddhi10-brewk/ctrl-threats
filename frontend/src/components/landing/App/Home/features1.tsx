import React from 'react';
import {featuresData} from '../../../../constants/features';
export default function Features1() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="font-medium text-black mb-4 text-left">
                        Experience Unmatched<br /> Cybersecurity with CtrlThreats
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature) => (
                        <div
                            key={feature.heading}
                            className="bg-white shadow-lg rounded-lg p-6 text-left hover:shadow-xl transition "
                        >
                            <img
                                src={feature.image}
                                alt={feature.heading}
                                className="w-12 h-12 mb-8"
                            />
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.heading}</h3>
                            <p className="text-gray-600 max-h-48 overflow-y-auto">{feature.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
