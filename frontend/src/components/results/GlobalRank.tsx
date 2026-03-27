import { IoMdInformationCircleOutline, IoMdRefresh } from "react-icons/io";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { GetRank } from "../../types/result";

const GlobalRank = ({ rankData }: { rankData: GetRank | undefined }) => {
    if (!rankData || !rankData.ranks) {
        return null; // Handle cases where rankData is not available
    }

    // Prepare Line Chart Data
    const lineChartData = {
        labels: rankData.ranks.map((item) => item.date),
        datasets: [
            {
                label: "Rank",
                data: rankData.ranks.map((item) => item.rank),
                borderColor: "#7D4EFF",
                backgroundColor: "#7D4EFF",
                pointBackgroundColor: "#7D4EFF",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 6,
                fill: false,
                tension: 0.3,
            },
        ],
    };

    // Line Chart Options
    const lineChartOptions = {
        responsive: true,
        scales: {
            x: { display: false, grid: { display: false } },
            y: { display: false, grid: { display: false } },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: "nearest" as "nearest",
                intersect: true,
                callbacks: {
                    label: (tooltipItem: any) => {
                        const rawValue = tooltipItem.raw as number; // Explicitly cast raw to number
                        return `Rank: ${rawValue.toLocaleString()}`;
                    },
                    title: (tooltipItems: any) =>
                        tooltipItems[0]?.label ? `Date: ${tooltipItems[0].label}` : "",
                },
            },
        },
        layout: { padding: 20 },
    };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6 hr-2">
            {/* Header Section */}
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#5900EA] uppercase">Global Rank</h2>
                <div className="flex items-center gap-2">
                    <IoMdInformationCircleOutline className="text-gray-500 text-xl cursor-pointer" />
                    <IoMdRefresh className="text-gray-500 text-xl cursor-pointer" />
                </div>
            </header>

            {/* Ranks List with Scroll */}
            <div className="mb-4 bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-600 mb-4">Ranks:</h3>
                <ul
                    className="space-y-2 overflow-y-auto max-h-48 pr-4"
                >
                    <style>
                        {`
                          ::-webkit-scrollbar {
                            width: 8px;
                          }
                          ::-webkit-scrollbar-thumb {
                            background-color: #8A2BE2;
                            border-radius: 4px;
                          }
                          ::-webkit-scrollbar-thumb:hover {
                            background-color: #6c1db9;
                          }
                          ::-webkit-scrollbar-track {
                            background-color: #f1f1f1;
                          }
                        `}
                    </style>
                    {rankData.ranks.map((item, index) => (
                        <div key={index}>
                        <li className="flex justify-between items-center text-sm text-gray-700">
                            <span>
                                <span className="font-bold">Date:</span> {item.date}
                            </span>
                            <span className="ml-2">
                                <span className="font-bold">Rank:</span>{" "}
                                {item.rank.toLocaleString()}
                            </span>
                        </li>
                        {/* Add horizontal line if it's not the last item */}
                        {index < rankData.ranks.length - 1 && (
                            <hr className="my-2 border-gray-300" />
                        )}
                    </div>
                    ))}
                </ul>
            </div>

            {/* Line Chart */}
            <div className="h-48 w-full bg-purple-50 rounded-lg flex items-center justify-center border border-gray-200 p-2">
                <Line data={lineChartData} options={lineChartOptions} />
            </div>
        </div>
    );
};

export default GlobalRank;
