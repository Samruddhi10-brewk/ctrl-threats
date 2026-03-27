import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { IoMdRefresh, IoMdInformationCircleOutline } from "react-icons/io";
import { topojson } from '../../constants/topojson';
import { useState, useEffect } from 'react';
import { ServerLocation as ServerLocationType } from '../../types/result';
import { primaryColorText } from '../../themes/colors';

const ServerLocation = ({ serverLocation }: { serverLocation: ServerLocationType | undefined }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
 
    const toggleInfo = () => setIsInfoVisible(!isInfoVisible);
 
    useEffect(() => {
        // Validate and extract coordinates
        if (serverLocation?.location_info) {
            const { Latitude, Longitude } = serverLocation.location_info;

            if (Latitude !== undefined && Longitude !== undefined) {
                const lat = parseFloat(Latitude.toString());
                const lon = parseFloat(Longitude.toString());
                if (!isNaN(lat) && !isNaN(lon)) {
                    setCoordinates([lon, lat]); // Longitude first
                    setError(null); // Clear previous errors if any
                    return;
                }
            }
        }

        // Set error if coordinates are invalid
        setError("Unable to retrieve valid coordinates for the server location.");
    }, [serverLocation]);

    // Handle missing serverLocation gracefully
    if (!serverLocation) {
        return <p>No Data Found</p>;
    }
 
    return (
        <section className="rounded-lg w-full shadow-md p-6 bg-white relative">
            <header className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${primaryColorText}`}>
                    SERVER LOCATION
                </h2>
                <div className="flex items-center gap-2">
                    <IoMdInformationCircleOutline
                        className="text-gray-500 text-xl cursor-pointer"
                        onClick={toggleInfo}
                    />
                    <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                </div>
            </header>

            {/* Information Box */}
            <div className={`p-4 rounded-lg text-sm text-gray-700 mb-4 h-0 transition-all ease-in-out ${isInfoVisible ? "h-fit block" : "hidden"}`}>
                <p className="text-sm text-gray-700 mb-4 border-gray-200 border p-3 rounded-md">
                    Using an IP address, the Server Location tool determines the actual location of a website's hosting server. It maps the IP address to a database with associated latitude and longitude values of known data centers or Internet service providers.
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={toggleInfo}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md">
                        Close
                    </button>
                </div>
            </div>

            {/* Server Information */}
            <h3 className="text-sm font-medium text-center text-gray-700 bg-purple-50 p-2 rounded-md mb-4">
                Server Location for <span className="font-bold">{serverLocation.domain}</span>
            </h3>
 
            <div className="p-3 rounded-lg space-y-2 mb-6">
                {[
                    { label: "IP Address", value: serverLocation.location_info?.["IP Address"] || 'N/A' },
                    { label: "City", value: serverLocation.location_info?.City || 'N/A' },
                    { label: "Region", value: serverLocation.location_info?.Region || 'N/A' },
                    { label: "Country", value: serverLocation.location_info?.Country || 'N/A' },
                    { label: "Latitude", value: serverLocation.location_info?.Latitude || 'N/A' },
                    { label: "Longitude", value: serverLocation.location_info?.Longitude || 'N/A' },
                    { label: "Timezone", value: serverLocation.location_info?.Timezone || 'N/A' },
                    { label: "Organization", value: serverLocation.location_info?.Organization || 'N/A' },
                ].map((item, index) => (
                    <div key={index} className="flex justify-between gap-x-8 py-2 border-b border-gray">
                        <span className="text-sm font-semibold">{item.label}:</span>
                        <span className="text-sm text-gray-500">{item.value}</span>
                    </div>
                ))}
            </div>

            {/* Map Display */}
            <div className="mt-4 rounded-lg p-4">
                {error ? (
                    <div className="bg-red-100 p-4 text-red-700 border border-red-300 rounded-md">
                        <p>{error}</p>
                    </div>
                ) : (
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            scale: 150,
                        }}
                        className="w-full h-90"
                    >
                        <Geographies geography={topojson}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="#FFFFFF"
                                        stroke="#8A2BE2"
                                        strokeWidth={0.5}
                                    />
                                ))
                            }
                        </Geographies>
                        {coordinates && (
                            <Marker coordinates={coordinates}>
                                <circle r={6} fill="#8A2BE2" />
                                <text
                                    textAnchor="middle"
                                    y={20}
                                    style={{ fontSize: 14, fontWeight: 'bold', fill: "black" }}
                                >
                                    {serverLocation.location_info?.Country}
                                </text>
                            </Marker>
                        )}
                    </ComposableMap>
                )}
            </div>
        </section>
    );
};
 
export default ServerLocation;
