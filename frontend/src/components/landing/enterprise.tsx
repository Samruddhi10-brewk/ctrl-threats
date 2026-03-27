import { enterpriseData } from '../../constants/enterprise';

function InfoCard({ heading, details, bgColor }) {
    return (
        <div className={`flex-1 p-8 rounded-lg shadow-lg border border-gray-300 ${bgColor}`}>
            <h3 className="text-3xl font-bold mb-4">{heading}</h3>
            <div className="text-lg space-y-3 font-light leading-relaxed">
                {details.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}

export default function EnterpriseSection() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {enterpriseData.map((item, index) => (
                    <InfoCard
                        key={index}
                        heading={item.heading}
                        details={item.details}
                        bgColor={item.bgColor}
                    />
                ))}
            </div>
        </div>
    );
}
