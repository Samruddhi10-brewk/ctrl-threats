import { webscanF } from '../../../../constants/webscanf';

const WebscanFeature = ({ feature, index }) => {
    const isLeft = index % 2 === 0;
    const isRight = index % 2 === 0;
    return (
        <>
            {index === 0 && (
                <div className="text-center mb-10 pt-10">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium mb-5 text-left">
                        Why Choose CTRL THREATS?
                    </h2>
                    <h4 className="text-gray-900 text-base md:text-lg font-medium text-left">
                        Comprehensive solution for end-to-end website security and performance.
                    </h4>
                </div>
            )}
            <div
                className={`flex flex-col lg:flex-row items-center py-12 gap-16 ${!isLeft && 'lg:flex-row-reverse'}`}
            >
                {/* Image Section */}
                <div className="relative w-full lg:w-1/2">
                    <img
                        src={feature.image1}
                        alt={feature.subHead}
                        className="rounded-lg shadow-lg object-cover"
                        style={{ 
                            width: '370px',
                            maxHeight: '410px' }}
                    />
                    <img
                        src={feature.image2}
                        alt={`${feature.subHead} overlay`}
                        className="absolute hidden sm:block rounded-md shadow-md object-cover"
                        style={{
                            width: '315px',
                                height: '180px',
                                top: '260px',
                                left: isRight ? '170px' : 'auto', // Position left for 1st and 3rd
                                right: isLeft ? 'auto' : '245px', // Position right for 2nd and 4th
                            zIndex: 10,
                        }}
                    />
                </div>

                {/* Text Section */}
                <div className="lg:w-1/2 px-4 md:px-8 text-center lg:text-left">
                    <h4 className="text-gray-900 text-sm md:text-base font-medium mb-2">
                        {feature.subHead}
                    </h4>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
                        {feature.heading}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {feature.details}
                    </p>
                </div>
            </div>
        </>
    );
};

export default function WebscanFeatures() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 py-12 space-y-16">
            {webscanF.map((feature, index) => (
                <WebscanFeature key={index} feature={feature} index={index} />
            ))}
        </div>
    );
}
